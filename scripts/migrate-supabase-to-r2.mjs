import { createHash } from "node:crypto";

import { createClient } from "@supabase/supabase-js";

import {
  S3Client,
  HeadObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

// --apply がなければ dry-run
const APPLY = process.argv.includes("--apply");
const eventTokenArg = process.argv.find((arg) =>
  arg.startsWith("--event-token="),
);
const eventToken = eventTokenArg?.split("=")[1];

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;

const STORAGE_BUCKET = "events";

function validateEnvironment() {
  const required = {
    NEXT_PUBLIC_SUPABASE_URL: SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
    R2_ACCOUNT_ID,
    R2_ACCESS_KEY_ID,
    R2_SECRET_ACCESS_KEY,
    R2_BUCKET_NAME,
  };

  const missing = Object.entries(required)
    .filter(([, value]) => !value)
    .map(([name]) => name);

  if (missing.length > 0) {
    throw new Error(
      `環境変数が不足しています: ${missing.join(", ")}`,
    );
  }

  if (!eventToken) {
    throw new Error(
      "--event-token=イベントトークン を指定してください",
    );
  }
}

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

async function getR2Object(client, key) {
  try {
    const result = await client.send(
      new GetObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
      }),
    );

    if (!result.Body) {
      throw new Error(`R2オブジェクトの本文がありません: ${key}`);
    }

    return Buffer.from(await result.Body.transformToByteArray());
  } catch (error) {
    throw new Error(
      `R2からの取得に失敗しました: ${key}: ${error.message}`,
    );
  }
}

async function objectExists(client, key) {
  try {
    await client.send(
      new HeadObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
      }),
    );
    return true;
  } catch (error) {
    const statusCode = error.$metadata?.httpStatusCode;

    if (
      statusCode === 404 ||
      error.name === "NotFound" ||
      error.name === "NoSuchKey"
    ) {
      return false;
    }

    throw error;
  }
}

async function getSupabasePhotos(supabase, eventId) {
  const { data, error } = await supabase
    .from("photos")
    .select("id, storage_path, file_size, mime_type")
    .eq("event_id", eventId)
    .order("id");

  if (error) {
    throw new Error(`写真一覧の取得に失敗しました: ${error.message}`);
  }

  return data ?? [];
}

async function migrate() {
  validateEnvironment();

  const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );

  const r2 = new S3Client({
    region: "auto",
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
  });

  try {
    console.log(`モード: ${APPLY ? "APPLY（実際に移行）" : "DRY RUN（確認のみ）"}`);
    console.log(`対象イベント: ${eventToken}`);

    // 1. イベント取得
    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("id, event_token, storage_provider")
      .eq("event_token", eventToken)
      .single();

    if (eventError || !event) {
      throw new Error(
        `イベントが見つかりません: ${eventError?.message ?? ""}`,
      );
    }

    if (event.storage_provider !== "supabase") {
      throw new Error(
        `移行対象外です。現在のstorage_provider: ${event.storage_provider}`,
      );
    }

    // 2. 写真一覧取得
    const photos = await getSupabasePhotos(supabase, event.id);

    console.log(`対象写真数: ${photos.length}枚`);

    if (photos.length === 0) {
      throw new Error("写真がありません。移行を中止します。");
    }

    let copiedCount = 0;
    let reusedCount = 0;
    let totalBytes = 0;

    // 3. 1枚ずつコピー・検証
    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      const key = photo.storage_path;

      if (!key.startsWith(`events/${eventToken}/`)) {
        throw new Error(`不正なstorage_pathです: ${key}`);
      }

      console.log(`[${i + 1}/${photos.length}] ${key}`);

      // Supabaseから取得
      const { data: sourceBlob, error: downloadError } =
        await supabase.storage
          .from(STORAGE_BUCKET)
          .download(key);

      if (downloadError || !sourceBlob) {
        throw new Error(
          `Supabaseから取得できません: ${key}: ${downloadError?.message ?? ""}`,
        );
      }

      const sourceBuffer = Buffer.from(
        await sourceBlob.arrayBuffer(),
      );

      const sourceHash = sha256(sourceBuffer);
      totalBytes += sourceBuffer.length;

      // R2に同じキーがあるか確認
      const exists = await objectExists(r2, key);

      if (exists) {
        // 既存オブジェクトはハッシュ一致を確認
        const r2Buffer = await getR2Object(r2, key);
        const r2Hash = sha256(r2Buffer);

        if (sourceHash !== r2Hash) {
          throw new Error(
            `既存R2オブジェクトと内容が不一致です。上書きせず停止します: ${key}`,
          );
        }

        console.log("  R2既存オブジェクト: ハッシュ一致");
        reusedCount++;
        continue;
      }

      if (!APPLY) {
        console.log("  R2未登録: APPLY時にコピー予定");
        continue;
      }

      // R2へアップロード
      await r2.send(
        new PutObjectCommand({
          Bucket: R2_BUCKET_NAME,
          Key: key,
          Body: sourceBuffer,
          ContentType: photo.mime_type || "application/octet-stream",
        }),
      );

      // R2から再取得してハッシュ検証
      const uploadedBuffer = await getR2Object(r2, key);
      const uploadedHash = sha256(uploadedBuffer);

      if (sourceHash !== uploadedHash) {
        throw new Error(`アップロード後のハッシュ不一致: ${key}`);
      }

      console.log("  R2アップロード・ハッシュ検証成功");
      copiedCount++;
    }

    console.log("--- コピー結果 ---");
    console.log(`対象写真: ${photos.length}枚`);
    console.log(`新規コピー: ${copiedCount}枚`);
    console.log(`既存再利用: ${reusedCount}枚`);
    console.log(`合計サイズ: ${(totalBytes / 1024 / 1024).toFixed(2)} MiB`);

    if (!APPLY) {
      console.log("DRY RUN完了。DB更新・R2への新規コピーは行っていません。");
      return;
    }

    // 4. DB更新直前に写真一覧が変わっていないか確認
    const latestPhotos = await getSupabasePhotos(supabase, event.id);

    const originalSignature = JSON.stringify(
      photos.map(({ id, storage_path, file_size }) => ({
        id,
        storage_path,
        file_size,
      })),
    );

    const latestSignature = JSON.stringify(
      latestPhotos.map(({ id, storage_path, file_size }) => ({
        id,
        storage_path,
        file_size,
      })),
    );

    if (originalSignature !== latestSignature) {
      throw new Error(
        "移行中に写真一覧が変更されました。DB更新を中止します。",
      );
    }

    // 5. 全写真の検証完了後にproviderを切り替える
    const { data: updatedEvent, error: updateError } = await supabase
      .from("events")
      .update({ storage_provider: "r2" })
      .eq("id", event.id)
      .eq("storage_provider", "supabase")
      .select("id")
      .maybeSingle();

    if (updateError) {
      throw new Error(
        `storage_provider更新に失敗しました: ${updateError.message}`,
      );
    }

    if (!updatedEvent) {
      throw new Error(
        "イベントのproviderを更新できませんでした。状態を確認してください。",
      );
    }

    console.log("移行完了！");
    console.log("storage_provider: supabase → r2");
    console.log("Supabase側の写真は削除していません。");
  } finally {
    r2.destroy();
  }
}

migrate().catch((error) => {
  console.error("\n移行エラー:");
  console.error(error);
  process.exitCode = 1;
});

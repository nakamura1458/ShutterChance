import { NextResponse } from "next/server";
import { zipSync } from "fflate";
import { getSignedDownloadUrl } from "@/lib/storage/r2-storage.service";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { getPhotosForBulkDownload } from "@/services/photo.service";

type Props = {
  params: Promise<{
    eventToken: string;
  }>;
};

// ========================================
// ファイル名に使えない文字を除去
// ========================================

function sanitizeFileName(name: string) {
  return name
    .replace(/[\\/:*?"<>|]/g, "_")
    .replace(/\s+/g, " ")
    .trim();
}

// ========================================
// ゲスト名をファイル名用に整形
// ========================================

function sanitizeGuestName(
  guestName: string | null
) {
  if (!guestName) {
    return "photo";
  }

  return (
    sanitizeFileName(guestName) || "photo"
  );
}

// ========================================
// 一括ダウンロード
// ========================================

export async function GET(
  request: Request,
  { params }: Props
) {
  const { eventToken } = await params;

  try {
    // ========================================
    // URLパラメータ
    // ========================================

    const url = new URL(request.url);

    const guestNames =
      url.searchParams.getAll("guest");

    // ========================================
    // イベント取得
    // ========================================

    const supabase = await createClient();

    const {
      data: event,
      error: eventError,
    } = await supabase
      .from("events")
      .select(`
        id,
        name,
        user_id,
        allow_guest_download,
        storage_provider
      `)
      .eq("event_token", eventToken)
      .maybeSingle();

    if (eventError) {
      console.error(
        "bulk download event error:",
        eventError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "イベントの取得に失敗しました。",
        },
        { status: 500 }
      );
    }

    if (!event) {
      return NextResponse.json(
        {
          success: false,
          error: "イベントが見つかりません。",
        },
        { status: 404 }
      );
    }

    // ========================================
    // 主催者 / ゲスト判定
    // ========================================

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const isOrganizer =
      !!user && user.id === event.user_id;

    // ========================================
    // ゲストのダウンロード許可確認
    // ========================================

    if (
      !isOrganizer &&
      !event.allow_guest_download
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "このイベントでは写真の保存が許可されていません。",
        },
        { status: 403 }
      );
    }

    // ========================================
    // 写真取得
    // ========================================

    const photos =
      await getPhotosForBulkDownload(
        event.id,
        guestNames
      );

    if (photos.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error:
            "保存できる写真がありません。",
        },
        { status: 404 }
      );
    }

    // ========================================
    // Storageから写真を取得
    // ========================================

    const admin = createAdminClient();

    const files: Record<string, Uint8Array> = {};

    for (
      let index = 0;
      index < photos.length;
      index++
    ) {
      const photo = photos[index];

      try {
        let buffer: Uint8Array;

        if (event.storage_provider === "r2") {
          // R2から署名付きURL経由で取得
          const signedUrl = await getSignedDownloadUrl({
            key: photo.storage_path,
            expiresIn: 300,
          });

          const response = await fetch(signedUrl);

          if (!response.ok) {
            throw new Error(
              `R2 download failed: ${response.status}`
            );
          }

          buffer = new Uint8Array(
            await response.arrayBuffer()
          );
        } else {
          // Supabase Storageから取得
          const {
            data: file,
            error: fileError,
          } = await admin.storage
            .from("events")
            .download(photo.storage_path);

          if (fileError || !file) {
            throw fileError ?? new Error("File not found");
          }

          buffer = new Uint8Array(
            await file.arrayBuffer()
          );
        }

        const number = String(
          index + 1
        ).padStart(4, "0");

        const guestName =
          sanitizeGuestName(photo.guest_name);

        files[
          `${number}_${guestName}.jpg`
        ] = buffer;
      } catch (error) {
        console.error(
          "bulk download storage error:",
          {
            photoId: photo.id,
            storagePath: photo.storage_path,
            error,
          }
        );

        continue;
      }
    }

    // ========================================
    // ZIP生成
    // ========================================

    if (
      Object.keys(files).length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "写真ファイルを取得できませんでした。",
        },
        { status: 500 }
      );
    }

    const zip = zipSync(files, {
      level: 0,
    });

    // ========================================
    // ZIPファイル名
    // ========================================

    const eventName =
      sanitizeFileName(event.name) ||
      "event";

    const zipFileName =
      `ShutterChance_${eventName}_写真.zip`;

    // ========================================
    // レスポンス
    // ========================================

    return new Response(
      Buffer.from(zip),
      {
        status: 200,
        headers: {
          "Content-Type":
            "application/zip",
          "Content-Disposition":
            `attachment; filename*=UTF-8''${encodeURIComponent(
              zipFileName
            )}`,
          "Cache-Control":
            "no-store",
        },
      }
    );
  } catch (error) {
    console.error(
      "bulk photo download error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "写真の一括保存に失敗しました。",
      },
      { status: 500 }
    );
  }
}
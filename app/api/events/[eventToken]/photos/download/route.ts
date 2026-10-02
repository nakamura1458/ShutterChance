import { NextResponse } from "next/server";
import { zipSync, strToU8 } from "fflate";

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
        allow_guest_download
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

    const files: Record<
      string,
      Uint8Array
    > = {};

    for (
      let index = 0;
      index < photos.length;
      index++
    ) {
      const photo = photos[index];

      const {
        data: file,
        error: fileError,
      } = await admin.storage
        .from("events")
        .download(photo.storage_path);

      if (fileError || !file) {
        console.error(
          "bulk download storage error:",
          {
            photoId: photo.id,
            storagePath:
              photo.storage_path,
            error: fileError,
          }
        );

        continue;
      }

      const buffer = new Uint8Array(
        await file.arrayBuffer()
      );

      const number = String(
        index + 1
      ).padStart(4, "0");

      const guestName =
        sanitizeGuestName(
          photo.guest_name
        );

      files[
        `${number}_${guestName}.jpg`
      ] = buffer;
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
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

import { createAdminClient } from "@/lib/supabase/admin";
import { getSignedUploadUrl } from "@/lib/storage/r2-storage.service";

type Props = {
  params: Promise<{
    eventToken: string;
  }>;
};

export async function POST(
  request: Request,
  { params }: Props,
) {
  try {
    const { eventToken } = await params;

    const body = await request.json();

    const fileName =
      typeof body.fileName === "string"
        ? body.fileName
        : "";

    const contentType =
      typeof body.contentType === "string"
        ? body.contentType
        : "";

    if (!fileName || !contentType.startsWith("image/")) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid file information",
        },
        { status: 400 },
      );
    }

    const supabaseAdmin = createAdminClient();

    // イベント確認
    const { data: event, error: eventError } =
      await supabaseAdmin
        .from("events")
        .select("id, storage_provider")
        .eq("event_token", eventToken)
        .maybeSingle();

    if (eventError || !event) {
      return NextResponse.json(
        {
          success: false,
          error: "Event not found",
        },
        { status: 404 },
      );
    }

    // 保存先に応じて処理を分岐
    if (event.storage_provider === "supabase") {
      return NextResponse.json({
        success: true,
        storageProvider: "supabase",
      });
    }

    if (event.storage_provider !== "r2") {
      return NextResponse.json(
        {
          success: false,
          error: "Unsupported storage provider",
        },
        { status: 400 },
      );
    }

    // 保存先キーはサーバー側で生成
    const storagePath =
      `events/${eventToken}/${randomUUID()}.jpg`;

    // 署名付きアップロードURL発行
    const uploadUrl = await getSignedUploadUrl({
      key: storagePath,
      contentType,
      expiresIn: 300,
    });

    return NextResponse.json({
      success: true,
      storageProvider: "r2",
      uploadUrl,
      storagePath,
      fileName: storagePath.split("/").pop(),
    });
  } catch (error) {
    console.error("upload-url error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create upload URL",
      },
      { status: 500 },
    );
  }
}
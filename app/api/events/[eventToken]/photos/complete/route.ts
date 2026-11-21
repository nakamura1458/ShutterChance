import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";
import {
  deleteObject,
  headObject,
} from "@/lib/storage/r2-storage.service";

type Props = {
  params: Promise<{
    eventToken: string;
  }>;
};

export async function POST(
  request: Request,
  { params }: Props,
) {
  let storagePath: string | null = null;

  try {
    const { eventToken } = await params;
    const body = await request.json();

    storagePath =
      typeof body.storagePath === "string"
        ? body.storagePath
        : null;

    const guestName =
      typeof body.guestName === "string"
        ? body.guestName.trim()
        : "";

    const originalFileName =
      typeof body.originalFileName === "string"
        ? body.originalFileName
        : "";

    if (
      !storagePath ||
      !originalFileName ||
      !storagePath.startsWith(
        `events/${eventToken}/`,
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid upload information",
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

    if (event.storage_provider !== "r2") {
      return NextResponse.json(
        {
          success: false,
          error: "This event does not use R2 storage",
        },
        { status: 400 },
      );
    }

    // R2上のオブジェクト確認
    const object = await headObject(storagePath);

    if (!object) {
      return NextResponse.json(
        {
          success: false,
          error: "Uploaded photo not found",
        },
        { status: 400 },
      );
    }

    // 写真情報をDBへ登録
    const fileName = storagePath.split("/").pop();

    if (!fileName) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid storage path",
        },
        { status: 400 },
      );
    }

    const { data, error } = await supabaseAdmin.rpc(
      "insert_photo_with_limit",
      {
        p_event_id: event.id,
        p_event_token: eventToken,
        p_guest_name: guestName,
        p_storage_path: storagePath,
        p_file_name: fileName,
        p_original_file_name: originalFileName,
        p_file_size: object.contentLength,
        p_mime_type: object.contentType ?? "image/jpeg",
      },
    );

    if (error) {
      // DB登録失敗時はR2上の写真を削除
      await deleteObject(storagePath);
      storagePath = null;

      console.error("photos insert error:", error);

      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      photo: data,
    });
  } catch (error) {
    console.error("upload complete error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to complete photo upload",
      },
      { status: 500 },
    );
  }
}
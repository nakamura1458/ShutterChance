import { NextResponse } from "next/server";
import { findExpiredPhotos } from "@/services/photo-retention.service";

export async function GET() {
  try {
    const expiredEvents = await findExpiredPhotos();

    return NextResponse.json({
      success: true,
      expiredEvents,
    });
  } catch (error) {
    console.error(
      "photo retention test error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "写真保存期限の確認に失敗しました",
      },
      { status: 500 }
    );
  }
}
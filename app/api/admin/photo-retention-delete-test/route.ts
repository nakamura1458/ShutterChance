import { NextResponse } from "next/server";
import { deleteExpiredPhotos } from "@/services/photo-retention.service";

export async function GET() {
  try {
    const results = await deleteExpiredPhotos();

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error(
      "photo retention delete test error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "期限切れ写真の削除に失敗しました",
      },
      { status: 500 }
    );
  }
}
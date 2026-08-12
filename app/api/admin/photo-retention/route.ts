import { NextResponse } from "next/server";
import { deleteExpiredPhotos } from "@/services/photo-retention.service";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (
    authHeader !==
    `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json(
      {
        success: false,
        error: "Unauthorized",
      },
      { status: 401 }
    );
  }

  try {
    const results = await deleteExpiredPhotos();

    console.log(
      "photo retention cron completed:",
      results
    );

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error(
      "photo retention cron error:",
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
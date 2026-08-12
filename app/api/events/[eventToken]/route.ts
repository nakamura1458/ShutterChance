import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { deleteEvent } from "@/services/event.service";

type Props = {
  params: Promise<{
    eventToken: string;
  }>;
};

export async function DELETE(
  request: Request,
  { params }: Props
) {
  const { eventToken } = await params;

  try {
    // ========================================
    // ログインユーザー確認
    // ========================================

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    // ========================================
    // イベント取得
    // ========================================

    const { data: event, error: eventError } =
      await supabaseAdmin
        .from("events")
        .select("id, user_id")
        .eq("event_token", eventToken)
        .maybeSingle();

    if (eventError) {
      console.error(
        "event取得エラー:",
        eventError
      );

      return NextResponse.json(
        {
          success: false,
          error: "イベントの取得に失敗しました",
        },
        { status: 500 }
      );
    }

    if (!event) {
      return NextResponse.json(
        {
          success: false,
          error: "イベントが見つかりません",
        },
        { status: 404 }
      );
    }

    // ========================================
    // イベント所有者確認
    // ========================================

    if (event.user_id !== user.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden",
        },
        { status: 403 }
      );
    }

    // ========================================
    // イベント削除
    // ========================================

    const result = await deleteEvent(event.id);

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error(
      "event delete error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "イベントの削除に失敗しました",
      },
      { status: 500 }
    );
  }
}
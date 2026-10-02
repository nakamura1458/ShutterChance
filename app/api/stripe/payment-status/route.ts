import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        {
          error: "session_id is required",
        },
        { status: 400 },
      );
    }

    const supabase = createAdminClient();

    const { data: event, error } = await supabase
      .from("events")
      .select("id, name, event_token, payment_status")
      .eq("stripe_checkout_session_id", sessionId)
      .maybeSingle();

    if (error) {
      console.error(
        "Payment status lookup failed:",
        error,
      );

      return NextResponse.json(
        {
          error: "Failed to check payment status",
        },
        { status: 500 },
      );
    }

    // Webhookがまだイベントを作成していない
    if (!event) {
      return NextResponse.json({
        status: "pending",
      });
    }

    // イベント作成済み
    return NextResponse.json({
      status: "completed",
      event: {
        id: event.id,
        name: event.name,
        eventToken: event.event_token,
      },
    });
  } catch (error) {
    console.error(
      "Payment status API error:",
      error,
    );

    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}
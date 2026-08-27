import { NextResponse } from "next/server";
import Stripe from "stripe";

import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  try {
    const { eventId, planId } = await req.json();

    if (!eventId || !planId) {
      return NextResponse.json(
        { error: "eventId と planId は必須です" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // プラン情報をDBから取得
    const { data: plan, error: planError } = await supabase
      .from("event_plans")
      .select("id, name, price, stripe_price_id")
      .eq("id", planId)
      .single();

    if (planError || !plan) {
      return NextResponse.json(
        { error: "プランが見つかりません" },
        { status: 404 }
      );
    }

    // FREEはStripe決済不要
    if (plan.id === "free") {
      return NextResponse.json(
        { error: "FREEプランは決済不要です" },
        { status: 400 }
      );
    }

    if (!plan.stripe_price_id) {
      return NextResponse.json(
        { error: "Stripe Price IDが設定されていません" },
        { status: 500 }
      );
    }

    // イベントの存在確認
    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("id, name")
      .eq("id", eventId)
      .single();

    if (eventError || !event) {
      return NextResponse.json(
        { error: "イベントが見つかりません" },
        { status: 404 }
      );
    }

    // Stripe Checkoutを作成
    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      line_items: [
        {
          price: plan.stripe_price_id,
          quantity: 1,
        },
      ],

      metadata: {
        eventId: event.id,
        planId: plan.id,
      },

      success_url:
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/events/${event.id}/payment/success`,

      cancel_url:
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/events/${event.id}/payment/cancel`,

      locale: "ja",
    });

    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);

    return NextResponse.json(
      { error: "決済画面の作成に失敗しました" },
      { status: 500 }
    );
  }
}
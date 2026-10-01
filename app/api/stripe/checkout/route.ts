import { NextResponse } from "next/server";
import { randomBytes } from "crypto";

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

    // ----------------------------------------
    // プラン情報をDBから取得
    // ----------------------------------------
    const { data: plan, error: planError } = await supabase
      .from("event_plans")
      .select("id, name, price")
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

    // ----------------------------------------
    // Stripe環境を決定
    // ----------------------------------------
    const stripeMode =
      process.env.STRIPE_MODE === "live"
        ? "live"
        : "test";

    // ----------------------------------------
    // 環境に対応したStripe Priceを取得
    // ----------------------------------------
    const { data: stripePrice, error: stripePriceError } =
      await supabase
        .from("stripe_prices")
        .select("stripe_price_id")
        .eq("plan_id", plan.id)
        .eq("environment", stripeMode)
        .single();

    if (stripePriceError || !stripePrice) {
      console.error("Stripe Price lookup failed:", {
        stripeMode,
        planId: plan.id,
        stripePrice,
        stripePriceError,
      });

      return NextResponse.json(
        {
          error: `Stripe Price IDが設定されていません（${stripeMode}）`,
        },
        { status: 500 }
      );
    }

    // ----------------------------------------
    // イベントの存在確認
    // ----------------------------------------
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

    // ----------------------------------------
    // 決済リターン用の一時トークンを発行
    // ----------------------------------------
    const paymentReturnToken = randomBytes(32).toString("hex");

    const paymentReturnExpiresAt = new Date(
      Date.now() + 15 * 60 * 1000,
    ).toISOString();

    const { error: paymentReturnUpdateError } = await supabase
      .from("events")
      .update({
        payment_return_token: paymentReturnToken,
        payment_return_expires_at: paymentReturnExpiresAt,
        payment_return_used_at: null,
      })
      .eq("id", event.id);

    if (paymentReturnUpdateError) {
      console.error(
        "Failed to create payment return token:",
        paymentReturnUpdateError,
      );

      return NextResponse.json(
        { error: "決済フローの準備に失敗しました" },
        { status: 500 },
      );
    }

    // ----------------------------------------
    // Stripe Checkoutを作成
    // ----------------------------------------
    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      line_items: [
        {
          price: stripePrice.stripe_price_id,
          quantity: 1,
        },
      ],

      metadata: {
        eventId: event.id,
        planId: plan.id,
      },

      success_url:
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/events/${event.id}/payment/success?token=${paymentReturnToken}`,

      cancel_url:
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/events/${event.id}/payment/cancel?token=${paymentReturnToken}`,

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
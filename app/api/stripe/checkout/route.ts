import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const {
      name,
      planId,
      eventStartAt,
      eventDeadline,
    } = await req.json();

    const authSupabase = await createClient();

    const {
      data: { user },
    } = await authSupabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "ログインが必要です",
        },
        { status: 401 },
      );
    }

    if (
      !name ||
      !planId ||
      !eventStartAt
    ) {
      return NextResponse.json(
        { error: "name、planId、eventStartAt は必須です" },
        { status: 400 },
      );
    }

    const supabase = createAdminClient();

    // ----------------------------------------
    // プラン情報をDBから取得
    // ----------------------------------------
    const { data: plan, error: planError } =
      await supabase
        .from("event_plans")
        .select("id, name, price")
        .eq("id", planId)
        .single();

    if (planError || !plan) {
      return NextResponse.json(
        { error: "プランが見つかりません" },
        { status: 404 },
      );
    }

    // FREEはStripe決済不要
    if (plan.id === "free") {
      return NextResponse.json(
        {
          error:
            "FREEプランは決済不要です",
        },
        { status: 400 },
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
    const {
      data: stripePrice,
      error: stripePriceError,
    } = await supabase
      .from("stripe_prices")
      .select("stripe_price_id")
      .eq("plan_id", plan.id)
      .eq("environment", stripeMode)
      .single();

    if (
      stripePriceError ||
      !stripePrice
    ) {
      console.error(
        "Stripe Price lookup failed:",
        {
          stripeMode,
          planId: plan.id,
          stripePrice,
          stripePriceError,
        },
      );

      return NextResponse.json(
        {
          error: `Stripe Price IDが設定されていません（${stripeMode}）`,
        },
        { status: 500 },
      );
    }

    // ----------------------------------------
    // Stripe Checkoutを作成
    // ----------------------------------------
    const session =
      await stripe.checkout.sessions.create({
        mode: "payment",

        line_items: [
          {
            price:
              stripePrice.stripe_price_id,
            quantity: 1,
          },
        ],

        metadata: {
          userId: user.id,
          name,
          planId: plan.id,
          eventStartAt,
          eventDeadline:
            eventDeadline ?? "",
        },

        success_url:
          `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/events/payment/success?session_id={CHECKOUT_SESSION_ID}`,

        cancel_url:
          `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/events/payment/cancel`,

        locale: "ja",
      });

    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    console.error(
      "Stripe Checkout Error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "決済画面の作成に失敗しました",
      },
      { status: 500 },
    );
  }
}
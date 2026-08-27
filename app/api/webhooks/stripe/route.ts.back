import { NextResponse } from "next/server";
import Stripe from "stripe";

import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Stripe signature がありません" },
        { status: 400 }
      );
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("STRIPE_WEBHOOK_SECRET が設定されていません");

      return NextResponse.json(
        { error: "Webhook secret が設定されていません" },
        { status: 500 }
      );
    }

    // Stripeの署名を検証
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );

    // 決済完了
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const eventId = session.metadata?.eventId;
      const planId = session.metadata?.planId;

      if (!eventId || !planId) {
        console.error("metadata がありません", {
          eventId,
          planId,
        });

        return NextResponse.json(
          { error: "eventId または planId がありません" },
          { status: 400 }
        );
      }

      // 決済が完了していることを確認
      if (session.payment_status !== "paid") {
        console.log("決済未完了:", session.payment_status);

        return NextResponse.json({
          received: true,
          message: "決済未完了のためDB更新なし",
        });
      }

      const supabase = createAdminClient();

      // イベントのプランを更新
      const { data: updatedEvent, error: updateError } = await supabase
        .from("events")
        .update({
          plan: planId,
        })
        .eq("id", eventId)
        .select("id, plan")
        .single();

      if (updateError) {
        console.error("❌ DB UPDATE ERROR");
        console.error("eventId:", eventId);
        console.error("planId:", planId);
        console.error("error:", updateError);

        return NextResponse.json(
          {
            error: "イベントのプラン更新に失敗しました",
            details: updateError.message,
            code: updateError.code,
            hint: updateError.hint,
            detailsFromSupabase: updateError.details,
          },
          { status: 500 }
        );
      }

      console.log("✅ DB UPDATE SUCCESS:", updatedEvent);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe Webhook Error:", error);

    return NextResponse.json(
      { error: "Webhook処理に失敗しました" },
      { status: 400 }
    );
  }
}
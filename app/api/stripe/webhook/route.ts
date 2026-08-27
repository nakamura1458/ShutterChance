import { NextResponse } from "next/server";
import Stripe from "stripe";

import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  const body = await req.text();

  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return new NextResponse("Missing stripe-signature", {
      status: 400,
    });
  }

  let event: Stripe.Event;

  // Stripe Webhook署名を検証
  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("STRIPE_WEBHOOK_SECRET is not configured");

      return new NextResponse(
        "Webhook secret is not configured",
        { status: 500 },
      );
    }

    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret,
    );
  } catch (error) {
    console.error(
      "Stripe webhook signature verification failed:",
      error,
    );

    return new NextResponse(
      "Webhook signature verification failed",
      { status: 400 },
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session =
          event.data.object as Stripe.Checkout.Session;

        // Stripe Checkout Sessionのmetadataから取得
        const eventId = session.metadata?.eventId;
        const planId = session.metadata?.planId;

        if (!eventId || !planId) {
          console.error(
            "Missing eventId or planId in Stripe metadata:",
            {
              eventId,
              planId,
              sessionId: session.id,
            },
          );

          return new NextResponse(
            "Missing metadata",
            { status: 400 },
          );
        }

        // 決済が完了しているか確認
        if (session.payment_status !== "paid") {
          console.log(
            "Payment is not completed:",
            session.payment_status,
          );

          break;
        }

        // Stripe WebhookではAdmin Clientを使用
        const supabase = createAdminClient();

        const {
          error,
          data,
        } = await supabase
          .from("events")
          .update({
            payment_status: "paid",
            stripe_checkout_session_id: session.id,
            stripe_payment_intent_id:
              typeof session.payment_intent === "string"
                ? session.payment_intent
                : null,
          })
          .eq("id", eventId)
          .eq("plan", planId)
          .select("id, plan, payment_status")
          .single();

        if (error) {
          console.error(
            "Failed to update event payment status:",
            JSON.stringify(error, null, 2),
          );

          return new NextResponse(
            "Database update failed",
            { status: 500 },
          );
        }

        console.log(
          "Payment completed and database updated:",
          {
            eventId,
            planId,
            sessionId: session.id,
            paymentIntentId:
              typeof session.payment_intent === "string"
                ? session.payment_intent
                : null,
            updatedEvent: data,
          },
        );

        break;
      }

      default:
        console.log(
          `Unhandled Stripe event: ${event.type}`,
        );
    }

    return NextResponse.json({
      received: true,
    });
  } catch (error) {
    console.error(
      "Stripe webhook error:",
      error,
    );

    return new NextResponse(
      "Webhook handler failed",
      { status: 500 },
    );
  }
}
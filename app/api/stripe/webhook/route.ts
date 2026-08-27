import { NextResponse } from "next/server";
import Stripe from "stripe";

import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const body = await req.text();

  const signature =
    req.headers.get("stripe-signature");

  if (!signature) {
    return new NextResponse(
      "Missing stripe-signature",
      { status: 400 },
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
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

        const eventId =
          session.metadata?.eventId;

        const planId =
          session.metadata?.planId;

        if (!eventId || !planId) {
          console.error(
            "Missing eventId or planId in Stripe metadata",
          );

          return new NextResponse(
            "Missing metadata",
            { status: 400 },
          );
        }

        // Stripe側で決済が完了していることを確認
        if (session.payment_status !== "paid") {
          console.log(
            "Payment is not completed:",
            session.payment_status,
          );

          break;
        }

        const supabase = await createClient();

        const { error } = await supabase
          .from("events")
          .update({
            payment_status: "paid",
            stripe_checkout_session_id:
              session.id,
            stripe_payment_intent_id:
              typeof session.payment_intent ===
              "string"
                ? session.payment_intent
                : null,
          })
          .eq("id", eventId)
          .eq("plan", planId);

        if (error) {
          console.error(
            "Failed to update event payment status:",
            error,
          );

          return new NextResponse(
            "Database update failed",
            { status: 500 },
          );
        }

        console.log(
          `Payment completed: event=${eventId}, plan=${planId}`,
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
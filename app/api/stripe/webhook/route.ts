import { NextResponse } from "next/server";
import Stripe from "stripe";

import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

// ----------------------------------------
// YYYY-MM-DD → JST 00:00:00
// ----------------------------------------
function dateToJSTStartOfDay(date: string) {
  return new Date(
    `${date}T00:00:00+09:00`,
  ).toISOString();
}

// ----------------------------------------
// YYYY-MM-DD → JST 23:59:59.999
// ----------------------------------------
function dateToJSTEndOfDay(date: string) {
  return new Date(
    `${date}T23:59:59.999+09:00`,
  ).toISOString();
}

export async function POST(req: Request) {
  const body = await req.text();

  const signature =
    req.headers.get("stripe-signature");

  if (!signature) {
    return new NextResponse(
      "Missing stripe-signature",
      {
        status: 400,
      },
    );
  }

  let event: Stripe.Event;

  // ----------------------------------------
  // Stripe Webhook署名を検証
  // ----------------------------------------
  try {
    const webhookSecret =
      process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error(
        "STRIPE_WEBHOOK_SECRET is not configured",
      );

      return new NextResponse(
        "Webhook secret is not configured",
        {
          status: 500,
        },
      );
    }

    event =
      stripe.webhooks.constructEvent(
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
      {
        status: 400,
      },
    );
  }

  try {
    switch (event.type) {
      // ----------------------------------------
      // Stripe Checkout 完了
      // ----------------------------------------
      case "checkout.session.completed": {
        const session =
          event.data.object as Stripe.Checkout.Session;

        // ----------------------------------------
        // metadata取得
        // ----------------------------------------
        const userId =
          session.metadata?.userId;

        const name =
          session.metadata?.name;

        const planId =
          session.metadata?.planId;

        const eventStartAt =
          session.metadata?.eventStartAt;

        const eventDeadline =
          session.metadata?.eventDeadline;

        if (
          !userId ||
          !name ||
          !planId ||
          !eventStartAt
        ) {
          console.error(
            "Missing required metadata:",
            {
              userId,
              name,
              planId,
              eventStartAt,
              eventDeadline,
              sessionId: session.id,
            },
          );

          return new NextResponse(
            "Missing metadata",
            {
              status: 400,
            },
          );
        }

        // ----------------------------------------
        // 決済完了確認
        // ----------------------------------------
        if (
          session.payment_status !== "paid"
        ) {
          console.log(
            "Payment is not completed:",
            session.payment_status,
          );

          break;
        }

        const supabase =
          createAdminClient();

        // ----------------------------------------
        // Webhook再送による二重作成防止
        // ----------------------------------------
        const {
          data: existingEvent,
          error: existingEventError,
        } = await supabase
          .from("events")
          .select("id")
          .eq(
            "stripe_checkout_session_id",
            session.id,
          )
          .maybeSingle();

        if (existingEventError) {
          console.error(
            "Failed to check existing event:",
            existingEventError,
          );

          return new NextResponse(
            "Database check failed",
            {
              status: 500,
            },
          );
        }

        if (existingEvent) {
          console.log(
            "Event already exists for this Stripe session:",
            {
              eventId: existingEvent.id,
              sessionId: session.id,
            },
          );

          break;
        }

        // ----------------------------------------
        // プラン取得
        // ----------------------------------------
        const {
          data: plan,
          error: planError,
        } = await supabase
          .from("event_plans")
          .select(
            "id, max_upload_count",
          )
          .eq("id", planId)
          .eq("is_active", true)
          .single();

        if (
          planError ||
          !plan
        ) {
          console.error(
            "Failed to fetch event plan:",
            {
              planId,
              planError,
            },
          );

          return new NextResponse(
            "Plan not found",
            {
              status: 500,
            },
          );
        }

        // ----------------------------------------
        // イベントトークン生成
        // ----------------------------------------
        const eventToken =
          crypto.randomUUID();

        // ----------------------------------------
        // イベント作成
        // ----------------------------------------
        const {
          data: createdEvent,
          error: createError,
        } = await supabase
          .from("events")
          .insert({
            name: name.trim(),
            event_token: eventToken,
            user_id: userId,
            plan: plan.id,

            max_upload_count:
              plan.max_upload_count,

            event_start_at:
              dateToJSTStartOfDay(
                eventStartAt,
              ),

            event_deadline:
              eventDeadline
                ? dateToJSTEndOfDay(
                    eventDeadline,
                  )
                : null,

            is_public: true,

            allow_guest_download: true,

            payment_status: "paid",

            stripe_checkout_session_id:
              session.id,

            stripe_payment_intent_id:
              typeof session.payment_intent ===
              "string"
                ? session.payment_intent
                : null,
          })
          .select(
            "id, name, event_token, plan, payment_status",
          )
          .single();

        if (createError) {
          console.error(
            "Failed to create event after payment:",
            JSON.stringify(
              createError,
              null,
              2,
            ),
          );

          return new NextResponse(
            "Event creation failed",
            {
              status: 500,
            },
          );
        }

        console.log(
          "Payment completed and event created:",
          {
            eventId:
              createdEvent.id,

            eventToken:
              createdEvent.event_token,

            planId,

            sessionId:
              session.id,

            paymentIntentId:
              typeof session.payment_intent ===
              "string"
                ? session.payment_intent
                : null,
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
      {
        status: 500,
      },
    );
  }
}
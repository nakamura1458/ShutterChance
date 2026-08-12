import { supabaseAdmin } from "@/lib/supabase/admin";
import { deleteEvent } from "@/services/event.service";

// ========================================
// 期限切れ写真の削除対象を確認
// ========================================

export async function findExpiredPhotos() {
  const now = new Date();

  const { data: events, error: eventsError } =
    await supabaseAdmin
      .from("events")
      .select(`
        id,
        plan,
        event_deadline
      `)
      .not("event_deadline", "is", null);

  if (eventsError) {
    throw eventsError;
  }

  const expiredEvents = [];

  for (const event of events ?? []) {
    if (!event.event_deadline) {
      continue;
    }

    const { data: eventPlan, error: planError } =
      await supabaseAdmin
        .from("event_plans")
        .select("retention_days")
        .eq("id", event.plan)
        .single();

    if (planError) {
      console.error(
        "event_plans取得失敗:",
        event.id,
        event.plan,
        planError
      );

      continue;
    }

    const expirationAt = new Date(
      new Date(event.event_deadline).getTime() +
        eventPlan.retention_days *
          24 *
          60 *
          60 *
          1000
    );

    if (expirationAt <= now) {
      expiredEvents.push({
        eventId: event.id,
        plan: event.plan,
        eventDeadline: event.event_deadline,
        retentionDays: eventPlan.retention_days,
        expirationAt: expirationAt.toISOString(),
      });
    }
  }

  return expiredEvents;
};

// ========================================
// 期限切れ写真を削除
// ========================================
export async function deleteExpiredPhotos() {
  const expiredEvents = await findExpiredPhotos();

  const results = [];

  for (const event of expiredEvents) {
    const result = await deleteEvent(event.eventId);

    results.push(result);
  }

  return results;
}
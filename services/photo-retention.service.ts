import { supabaseAdmin } from "@/lib/supabase/admin";

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
    // ----------------------------------------
    // 写真取得
    // ----------------------------------------

    const { data: photos, error: photosError } =
      await supabaseAdmin
        .from("photos")
        .select("id, storage_path")
        .eq("event_id", event.eventId);

    if (photosError) {
      throw photosError;
    }

    console.log("削除対象写真:", {
      eventId: event.eventId,
      count: photos?.length ?? 0,
      photos,
    });

    // ----------------------------------------
    // Storage削除
    // ----------------------------------------

    const storagePaths =
      (photos ?? [])
        .map((photo) => photo.storage_path)
        .filter(Boolean);

    if (storagePaths.length > 0) {
      const { error: storageError } =
        await supabaseAdmin.storage
          .from("events")
          .remove(storagePaths);

      if (storageError) {
        throw storageError;
      }
    }

    // ----------------------------------------
    // DB削除
    // ----------------------------------------

    const { error: deleteError } =
      await supabaseAdmin
        .from("photos")
        .delete()
        .eq("event_id", event.eventId);

    if (deleteError) {
      throw deleteError;
    }

    results.push({
      eventId: event.eventId,
      deletedPhotos: photos?.length ?? 0,
    });
  }

  return results;
}
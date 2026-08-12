import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function getEventByToken(
  eventToken: string,
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("event_token", eventToken)
    .maybeSingle();

  if (error) {
    console.error(
      "getEventByToken error:",
      error,
    );

    throw error;
  }

  return data;
}

export async function getMyEvents() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return data;
}

export async function getMyEventByToken(
  eventToken: string,
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("event_token", eventToken)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error(
      "getMyEventByToken error:",
      error,
    );

    return null;
  }

  return data;
}


// ========================================
// イベント削除
// ========================================
export async function deleteEvent(
  eventId: string,
) {
  // 写真取得
  const { data: photos, error: photosError } =
    await supabaseAdmin
      .from("photos")
      .select("id, storage_path")
      .eq("event_id", eventId);

  if (photosError) {
    throw photosError;
  }

  // Storage削除
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

  // photos削除
  const { error: deletePhotosError } =
    await supabaseAdmin
      .from("photos")
      .delete()
      .eq("event_id", eventId);

  if (deletePhotosError) {
    throw deletePhotosError;
  }

  // events削除
  const { error: deleteEventError } =
    await supabaseAdmin
      .from("events")
      .delete()
      .eq("id", eventId);

  if (deleteEventError) {
    throw deleteEventError;
  }

  return {
    eventId,
    deletedPhotos: photos?.length ?? 0,
    deletedEvent: true,
  };
}
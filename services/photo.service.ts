import { supabase } from "@/lib/supabase/server";

export async function getPhotos(eventId: string) {
  const { data, error } = await supabase
    .from("photos")
    .select("*")
    .eq("event_id", eventId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data.map((photo) => ({
    id: photo.id,
    guest_name: photo.guest_name,
    image_url: supabase.storage
      .from("events")
      .getPublicUrl(photo.storage_path).data.publicUrl,
  }));
}
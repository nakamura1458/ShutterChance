import { createClient } from "@/lib/supabase/server";

export async function getPhotos(eventId: string) {
  const supabase = await createClient();

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

export async function getPhotosPaginated(
  eventId: string,
  page: number,
  pageSize: number = 60
) {
  const supabase = await createClient();

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from("photos")
    .select("*", { count: "exact" })
    .eq("event_id", eventId)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    throw error;
  }

  const photos = data.map((photo) => ({
    id: photo.id,
    guest_name: photo.guest_name,
    image_url: supabase.storage
      .from("events")
      .getPublicUrl(photo.storage_path).data.publicUrl,
  }));

  return {
    photos,
    totalCount: count ?? 0,
  };
}
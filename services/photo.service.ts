import { createClient } from "@/lib/supabase/server";
import type { PhotoListItem } from "@/types/photo";

export type PhotoSortOrder =
  | "newest"
  | "oldest"
  | "likes";

// ========================================
// 写真一覧取得
// イベントトップ用
// ========================================

export async function getPhotos(
  eventId: string
): Promise<PhotoListItem[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("photos")
    .select(`
      id,
      guest_name,
      storage_path,
      created_at
    `)
    .eq("event_id", eventId)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return (data ?? []).map((photo) => ({
    id: photo.id,
    guest_name: photo.guest_name,
    image_url: supabase.storage
      .from("events")
      .getPublicUrl(photo.storage_path)
      .data.publicUrl,
    created_at: photo.created_at,
    like_count: 0,
  }));
}

// ========================================
// 写真一覧取得
// ページング・並び替え対応
// ========================================

export async function getPhotosPaginated(
  eventId: string,
  page: number,
  pageSize: number = 60,
  sort: PhotoSortOrder = "newest"
) {
  const supabase = await createClient();

  // ========================================
  // Photos
  // ========================================

  const { data, error } =
    await supabase.rpc(
      "get_event_photos",
      {
        p_event_id: eventId,
        p_page: page,
        p_page_size: pageSize,
        p_sort: sort,
      }
    );

  if (error) {
    throw error;
  }

  const photos: PhotoListItem[] =
    (data ?? []).map((photo: {
      id: string;
      guest_name: string | null;
      storage_path: string;
      created_at: string;
      like_count: number | string;
    }) => ({
      id: photo.id,
      guest_name: photo.guest_name,
      image_url: supabase.storage
        .from("events")
        .getPublicUrl(photo.storage_path)
        .data.publicUrl,
      created_at: photo.created_at,
      like_count: Number(
        photo.like_count ?? 0
      ),
    }));

  // ========================================
  // Total count
  // ========================================

  const {
    count,
    error: countError,
  } = await supabase
    .from("photos")
    .select("id", {
      count: "exact",
      head: true,
    })
    .eq("event_id", eventId);

  if (countError) {
    throw countError;
  }

  return {
    photos,
    totalCount: count ?? 0,
  };
}
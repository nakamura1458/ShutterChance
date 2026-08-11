import { supabase } from "@/lib/supabase/client";

export async function uploadPhoto(
  eventId: string,
  eventToken: string,
  guestName: string,
  file: File
) {
  const fileName = `${crypto.randomUUID()}.jpg`;

  const storagePath =
    `events/${eventToken}/${fileName}`;

  // ========================================
  // Storageへアップロード
  // ========================================

  const { error: uploadError } =
    await supabase.storage
      .from("events")
      .upload(storagePath, file, {
        contentType: file.type,
      });

  if (uploadError) {
    throw uploadError;
  }

  // ========================================
  // DBへ登録
  // ========================================

  const { data, error } = await supabase.rpc(
    "insert_photo_with_limit",
    {
      p_event_id: eventId,
      p_event_token: eventToken,
      p_guest_name: guestName,
      p_storage_path: storagePath,
      p_file_name: fileName,
      p_original_file_name: file.name,
      p_file_size: file.size,
      p_mime_type: file.type,
    }
  );

  // ========================================
  // DB登録失敗
  // ========================================

  if (error) {
    console.error(
      "photos insert error",
      error
    );

    // DB登録に失敗したらStorageから削除
    await supabase.storage
      .from("events")
      .remove([storagePath]);

    throw error;
  }

  return data;
}
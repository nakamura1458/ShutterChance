
import { supabase } from "@/lib/supabase/client";

export async function uploadPhoto(
  eventId: string,
  eventToken: string,
  guestName: string,
  file: File,
) {
  // ========================================
  // 1. 保存先情報を取得
  // ========================================

  const urlResponse = await fetch(
    `/api/events/${eventToken}/photos/upload-url`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileName: file.name,
        contentType: file.type,
      }),
    },
  );

  const urlResult = await urlResponse.json();

  if (!urlResponse.ok || !urlResult.success) {
    throw new Error(
      urlResult.error ?? "保存先の取得に失敗しました。",
    );
  }

  // ========================================
  // 2. Supabase Storage
  // ========================================

  if (urlResult.storageProvider === "supabase") {
    const fileName = `${crypto.randomUUID()}.jpg`;
    const storagePath = `events/${eventToken}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("events")
      .upload(storagePath, file, {
        contentType: file.type,
      });

    if (uploadError) {
      throw uploadError;
    }

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
      },
    );

    if (error) {
      await supabase.storage
        .from("events")
        .remove([storagePath]);

      throw error;
    }

    return data;
  }

  // ========================================
  // 3. R2 Storage
  // ========================================

  if (urlResult.storageProvider !== "r2") {
    throw new Error("不明な保存先です。");
  }

  const { uploadUrl, storagePath } = urlResult;

  const uploadResponse = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  if (!uploadResponse.ok) {
    throw new Error("R2への写真アップロードに失敗しました。");
  }

  // ========================================
  // 4. アップロード完了API
  // ========================================

  const completeResponse = await fetch(
    `/api/events/${eventToken}/photos/complete`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        storagePath,
        guestName,
        originalFileName: file.name,
      }),
    },
  );

  const completeResult = await completeResponse.json();

  if (!completeResponse.ok || !completeResult.success) {
    throw new Error(
      completeResult.error ?? "写真の登録に失敗しました。",
    );
  }

  return completeResult.photo;
}
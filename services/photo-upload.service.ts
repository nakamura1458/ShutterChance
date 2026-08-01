import { supabase } from "@/lib/supabase/client";

export async function uploadPhoto(
  eventId: string,
  eventToken: string,
  guestName: string,
  file: File
) {
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

  const { data, error } = await supabase
    .from("photos")
    .insert({
      event_id: eventId,
      guest_name: guestName,
      storage_path: storagePath,
      file_name: fileName,
      original_file_name: file.name,
      file_size: file.size,
      mime_type: file.type,
    })
    .select()
    .single();

  if (error) {
    console.error("photos insert error", error);
    throw error;
  }

  return data;
}
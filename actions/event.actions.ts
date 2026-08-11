"use server";

import { createClient } from "@/lib/supabase/server";
import { getEventByToken } from "@/services/event.service";

type CheckEventTokenResult =
  | {
      success: true;
      eventToken: string;
    }
  | {
      success: false;
      message: string;
    };

export async function checkEventToken(
  eventToken: string,
): Promise<CheckEventTokenResult> {
  const token = eventToken.trim();

  if (!token) {
    return {
      success: false,
      message: "イベントコードを入力してください",
    };
  }

  const event = await getEventByToken(token);

  if (!event) {
    return {
      success: false,
      message: "イベントが見つかりませんでした",
    };
  }

  return {
    success: true,
    eventToken: token,
  };
}

type UpdateEventSettingsInput = {
  eventId: string;
  name: string;
  maxUploadCount: number;
  uploadDeadline: string | null;
  eventDeadline: string | null;
  isPublic: boolean;
  allowGuestDownload: boolean;
};

export async function updateEventSettings(
  input: UpdateEventSettingsInput,
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const name = input.name.trim();

  if (!name) {
    throw new Error("イベント名を入力してください。");
  }

  if (
    !Number.isInteger(input.maxUploadCount) ||
    input.maxUploadCount < 1
  ) {
    throw new Error(
      "アップロード枚数は1以上で指定してください。",
    );
  }

  const { error } = await supabase
    .from("events")
    .update({
      name,
      max_upload_count: input.maxUploadCount,
      upload_deadline: input.uploadDeadline,
      event_deadline: input.eventDeadline,
      is_public: input.isPublic,
      allow_guest_download: input.allowGuestDownload,
    })
    .eq("id", input.eventId)
    .eq("user_id", user.id);

  if (error) {
    throw error;
  }

  return {
    success: true,
  };
}
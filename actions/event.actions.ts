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

type CreateEventInput = {
  name: string;
  plan: "free" | "standard" | "plus";
  uploadDeadline: string | null;
  eventDeadline: string | null;
};

export async function createEvent(
  input: CreateEventInput,
) {
  const supabase = await createClient();

  // ----------------------------------------
  // ログインユーザー確認
  // ----------------------------------------

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // ----------------------------------------
  // 基本バリデーション
  // ----------------------------------------

  const name = input.name.trim();

  if (!name) {
    throw new Error("イベント名を入力してください。");
  }

  if (
    input.plan !== "free" &&
    input.plan !== "standard" &&
    input.plan !== "plus"
  ) {
    throw new Error("不正なプランです。");
  }

  // ----------------------------------------
  // プラン設定
  // ----------------------------------------

  const { EVENT_PLANS } = await import(
    "@/lib/event-plan"
  );

  const plan = EVENT_PLANS[input.plan];

  // ----------------------------------------
  // 管理者判定
  // ----------------------------------------

  const isAdmin =
    user.id ===
    process.env.SHUTTERCHANCE_ADMIN_USER_ID;

  // ----------------------------------------
  // イベントトークン生成
  // ----------------------------------------

  const eventToken = crypto.randomUUID();

  // ----------------------------------------
  // イベント作成
  // ----------------------------------------

  const { data, error } = await supabase
    .from("events")
    .insert({
      name,
      event_token: eventToken,
      user_id: user.id,

      plan: input.plan,

      max_upload_count: isAdmin
        ? 2147483647
        : plan.maxUploadCount,

      upload_deadline: input.uploadDeadline,
      event_deadline: input.eventDeadline,

      is_public: true,
      allow_guest_download: true,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return {
    success: true,
    event: data,
  };
}

export async function checkPhotoUploadLimit(
  eventId: string,
  uploadCount: number,
) {
  const supabase = await createClient();

  // ----------------------------------------
  // イベント取得
  // ----------------------------------------

  const { data: event, error: eventError } =
    await supabase
      .from("events")
      .select(
        "id, user_id, max_upload_count",
      )
      .eq("id", eventId)
      .single();

  if (eventError || !event) {
    throw new Error(
      "イベント情報を取得できませんでした。",
    );
  }

  // ----------------------------------------
  // 管理者イベント
  // ----------------------------------------

  const isAdminEvent =
    event.user_id ===
    process.env.SHUTTERCHANCE_ADMIN_USER_ID;

  if (isAdminEvent) {
    return {
      allowed: true,
      remaining: null,
    };
  }

  // ----------------------------------------
  // 現在の写真枚数
  // ----------------------------------------

  const { count, error: countError } =
    await supabase
      .from("photos")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("event_id", eventId);

  if (countError) {
    throw new Error(
      "現在の写真枚数を確認できませんでした。",
    );
  }

  const currentCount = count ?? 0;

  // ----------------------------------------
  // アップロード後の枚数
  // ----------------------------------------

  const nextCount =
    currentCount + uploadCount;

  // ----------------------------------------
  // 上限チェック
  // ----------------------------------------

  if (
    nextCount > event.max_upload_count
  ) {
    const remaining =
      Math.max(
        event.max_upload_count -
          currentCount,
        0,
      );

    return {
      allowed: false,
      remaining,
      maxUploadCount:
        event.max_upload_count,
      currentCount,
    };
  }

  return {
    allowed: true,
    remaining:
      event.max_upload_count -
      nextCount,
    maxUploadCount:
      event.max_upload_count,
    currentCount,
  };
}

export async function getPhotoUploadLimit(
  eventId: string,
) {
  const supabase = await createClient();

  // ----------------------------------------
  // イベント取得
  // ----------------------------------------

  const { data: event, error: eventError } =
    await supabase
      .from("events")
      .select(
        "id, user_id, max_upload_count",
      )
      .eq("id", eventId)
      .single();

  if (eventError || !event) {
    throw new Error(
      "イベント情報を取得できませんでした。",
    );
  }

  // ----------------------------------------
  // 管理者イベント
  // ----------------------------------------

  const isAdminEvent =
    event.user_id ===
    process.env.SHUTTERCHANCE_ADMIN_USER_ID;

  if (isAdminEvent) {
    return {
      unlimited: true,
      currentCount: 0,
      maxUploadCount: null,
      remaining: null,
    };
  }

  // ----------------------------------------
  // 現在の写真枚数
  // ----------------------------------------

  const { count, error: countError } =
    await supabase
      .from("photos")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("event_id", eventId);

  if (countError) {
    throw new Error(
      "現在の写真枚数を確認できませんでした。",
    );
  }

  const currentCount = count ?? 0;

  const remaining = Math.max(
    event.max_upload_count - currentCount,
    0,
  );

  return {
    unlimited: false,
    currentCount,
    maxUploadCount:
      event.max_upload_count,
    remaining,
  };
}
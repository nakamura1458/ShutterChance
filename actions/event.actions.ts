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
  eventStartAt: string;
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

  // ----------------------------------------
  // イベント取得
  // ----------------------------------------

  const { data: event, error: eventError } =
    await supabase
      .from("events")
      .select("id, plan, user_id")
      .eq("id", input.eventId)
      .eq("user_id", user.id)
      .single();

  if (eventError || !event) {
    throw new Error("イベントが見つかりません。");
  }

  // ----------------------------------------
  // プラン取得
  // ----------------------------------------

  const { data: plan, error: planError } =
    await supabase
      .from("event_plans")
      .select(
        "id, max_upload_count, retention_days",
      )
      .eq("id", event.plan)
      .eq("is_active", true)
      .single();

  if (planError || !plan) {
    throw new Error(
      "イベントプランを取得できませんでした。",
    );
  }

  // ----------------------------------------
  // 基本バリデーション
  // ----------------------------------------

  const name = input.name.trim();

  if (!name) {
    throw new Error(
      "イベント名を入力してください。",
    );
  }

  // ----------------------------------------
  // イベント設定更新
  // ----------------------------------------

  const { error } = await supabase
    .from("events")
    .update({
      name,

      max_upload_count: plan.max_upload_count,
      
      retention_days: plan.retention_days,

      event_start_at: dateToJSTStartOfDay(
        input.eventStartAt,
      ),

      event_deadline:
        input.eventDeadline
          ? dateToJSTEndOfDay(
              input.eventDeadline,
            )
          : null,

      is_public: input.isPublic,

      allow_guest_download: input.allowGuestDownload,
    })
  
  if (error) {
    throw error;
  }

  return {
    success: true,
  };
}

function dateToJSTStartOfDay(
  date: string,
) {
  return new Date(
    `${date}T00:00:00+09:00`,
  ).toISOString();
}

function dateToJSTEndOfDay(
  date: string,
) {
  return new Date(
    `${date}T23:59:59.999+09:00`,
  ).toISOString();
}

type CreateEventInput = {
  name: string;
  plan: string;
  eventStartAt: string;
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
    throw new Error(
      "イベント名を入力してください。",
    );
  }

  // ----------------------------------------
  // プラン取得
  // ----------------------------------------

  const { data: plan, error: planError } =
    await supabase
      .from("event_plans")
      .select(
        "id, name, price, max_upload_count, retention_days",
      )
      .eq("id", input.plan)
      .eq("is_active", true)
      .single();

  if (planError || !plan) {
    console.error("event_plans error:", planError);

    throw new Error(
      "イベントプランを取得できませんでした。",
    );
  }

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

      // DBのプランIDを保存
      plan: plan.id,

      // 枚数もDBのプラン設定から決定
      max_upload_count: isAdmin
        ? 2147483647
        : plan.max_upload_count,

      retention_days: plan.retention_days,

      // 日本時間として保存
      event_start_at:
        dateToJSTStartOfDay(
          input.eventStartAt,
        ),

      // 終了日はその日の23:59:59.999まで
      event_deadline:
        input.eventDeadline
          ? dateToJSTEndOfDay(
              input.eventDeadline,
            )
          : null,

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

export async function getEventPlans() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("event_plans")
    .select(
      "id, name, price, max_upload_count, retention_days, is_active",
    )
    .eq("is_active", true)
    .order("price", {
      ascending: true,
    });

  if (error) {
    console.error("getEventPlans error:", error);

    throw new Error(
      `イベントプランを取得できませんでした: ${error.message}`,
    );
  }

  return data;
}
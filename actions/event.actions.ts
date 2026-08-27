"use server";

import { createClient } from "@/lib/supabase/server";
import { getEventByToken } from "@/services/event.service";

// ----------------------------------------
// YYYY-MM-DD → JST 00:00:00
// ----------------------------------------
function dateToJSTStartOfDay(date: string) {
  return new Date(
    `${date}T00:00:00+09:00`,
  ).toISOString();
}

// ----------------------------------------
// YYYY-MM-DD → JST 23:59:59.999
// ----------------------------------------
function dateToJSTEndOfDay(date: string) {
  return new Date(
    `${date}T23:59:59.999+09:00`,
  ).toISOString();
}

// ----------------------------------------
// イベントトークン取得判定
// ----------------------------------------
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


// ----------------------------------------
// イベント設定アップデート
// ----------------------------------------
type UpdateEventSettingsInput = {
  eventId: string;
  name: string;
  eventDeadline: string | null;
  isPublic: boolean;
  allowGuestDownload: boolean;
};

export async function updateEventSettings(
  input: UpdateEventSettingsInput,
) {
  const supabase = await createClient();

  // ログインユーザー確認
  const {data: { user }} = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // イベント情報取得（名前、プラン、作成者）
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

  // プラン取得（アップロード上限、保存期間）
  const { data: plan, error: planError } =
    await supabase
      .from("event_plans")
      .select(
        "id, max_upload_count, retention_days",
      )
      .eq("id", event.plan)
      .single();

  if (planError || !plan) {
    throw new Error(
      "イベントプランを取得できませんでした。",
    );
  }

  // イベント名確認
  const name = input.name.trim();

  if (!name) {
    throw new Error(
      "イベント名を入力してください。",
    );
  }

  // イベント設定更新
  const { error } = await supabase
    .from("events")
    .update({
      name,
      max_upload_count: plan.max_upload_count,
      // YYYY-MM-DDT23:59:59(UTC+9)形式
      event_deadline: input.eventDeadline ? dateToJSTEndOfDay(input.eventDeadline) : null,
      is_public: input.isPublic,
      allow_guest_download: input.allowGuestDownload,
    })
    .eq("id", event.id);
  
  if (error) {
    throw error;
  }

  return {
    success: true,
  };
}


// ----------------------------------------
// イベント新規作成
// ----------------------------------------
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

  // ログインユーザー確認
  const {data: { user }} = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // イベント名チェック
  const name = input.name.trim();

  if (!name) {
    throw new Error(
      "イベント名を入力してください。",
    );
  }

  // プラン情報取得（プラン名、料金、アップロード上限、保存期間）
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

  // 管理者判定
  const isAdmin =
    user.id ===
    process.env.SHUTTERCHANCE_ADMIN_USER_ID;

  // イベントトークン生成
  const eventToken = crypto.randomUUID();

  // イベント作成
  const { data, error } = await supabase
    .from("events")
    .insert({
      name,
      event_token: eventToken,
      user_id: user.id,

      plan: plan.id,

      max_upload_count: isAdmin
        ? 2147483647
        : plan.max_upload_count,

      event_start_at: dateToJSTStartOfDay(input.eventStartAt),

      event_deadline: input.eventDeadline
        ? dateToJSTEndOfDay(input.eventDeadline)
        : null,

      is_public: true,
      allow_guest_download: true,

      payment_status:
        plan.id === "free"
          ? "paid"
          : "pending",
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


// ----------------------------------------
// アップロード上限確認（アップロード時）
// ----------------------------------------
export async function checkPhotoUploadLimit(
  eventId: string,
  uploadCount: number,
) {
  const supabase = await createClient();

  // イベント情報取得（イベントID、作成者、アップロード上限）
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

  //==管理者イベント==//
  const isAdminEvent =
    event.user_id ===
    process.env.SHUTTERCHANCE_ADMIN_USER_ID;

  // 無制限に許可
  if (isAdminEvent) {
    return {
      allowed: true,
      remaining: null,
    };
  }

  //==管理者以外==//
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

  // アップロード後の枚数
  const nextCount = currentCount + uploadCount;

  // 上限チェック（アップロード後に上限を超える場合）
  if ( nextCount > event.max_upload_count ) {
    const remaining = Math.max( event.max_upload_count - currentCount, 0);

    return {
      allowed: false,
      remaining,
      maxUploadCount: event.max_upload_count,
      currentCount,
    };
  }

  // 上限チェック（アップロード後に上限を超えない場合）
  return {
    allowed: true,
    remaining: event.max_upload_count - nextCount,
    maxUploadCount: event.max_upload_count,
    currentCount,
  };
}


// ----------------------------------------
// アップロード上限取得
// ----------------------------------------
export async function getPhotoUploadLimit(
  eventId: string,
) {
  const supabase = await createClient();

  // イベント情報取得（イベント、作成者、アップロード上限）
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

  //==管理者イベント==//
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

  //==管理者以外==//
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

  const remaining = Math.max(event.max_upload_count - currentCount, 0);

  return {
    unlimited: false,
    currentCount,
    maxUploadCount: event.max_upload_count,
    remaining,
  };
}


// ----------------------------------------
// イベントプラン情報取得
// ----------------------------------------
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
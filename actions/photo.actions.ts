"use server";

import { createClient } from "@/lib/supabase/server";
import { getPhotos } from "@/services/photo.service";

// ========================================
// 写真一覧取得
// ========================================

export async function fetchPhotos(
  eventId: string,
) {
  return await getPhotos(eventId);
}

// ========================================
// 写真アップロード上限チェック
// ========================================

export async function checkPhotoUploadLimit(
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
        "id, max_upload_count, event_start_at, event_deadline",
      )
      .eq("id", eventId)
      .single();

  if (eventError || !event) {
    throw new Error(
      "イベントが見つかりませんでした。",
    );
  }

  // ----------------------------------------
  // イベント終了チェック
  // ----------------------------------------

  if (
    event.event_deadline &&
    new Date(event.event_deadline).getTime() <=
      Date.now()
  ) {
    throw new Error(
      "このイベントは終了しているため、写真をアップロードできません。",
    );
  }

  // ----------------------------------------
  // イベント開始前チェック
  // ----------------------------------------

  if (
    event.event_start_at &&
    new Date(event.event_start_at).getTime() >
      Date.now()
  ) {
    throw new Error(
      "このイベントはまだ開始されていません。",
    );
  }

  // ----------------------------------------
  // イベント終了チェック
  // ----------------------------------------

  if (
    event.event_deadline &&
    new Date(event.event_deadline).getTime() <=
      Date.now()
  ) {
    throw new Error(
      "このイベントは終了しています。",
    );
  }

  // ----------------------------------------
  // 現在の写真枚数取得
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
    throw countError;
  }

  const currentCount = count ?? 0;

  // ----------------------------------------
  // 上限チェック
  // ----------------------------------------

  if (
    currentCount >= event.max_upload_count
  ) {
    throw new Error(
      `このイベントの写真保存上限（${event.max_upload_count}枚）に達しています。`,
    );
  }

  return {
    success: true,
    currentCount,
    maxUploadCount: event.max_upload_count,
  };
}
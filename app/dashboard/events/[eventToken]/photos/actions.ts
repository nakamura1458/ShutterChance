"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

type DeletePhotoResult = {
  success: boolean;
  error?: string;
};

export async function deletePhoto(
  eventToken: string,
  photoId: string
): Promise<DeletePhotoResult> {
  // ========================================
  // ログイン確認
  // ========================================

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: "ログインが必要です。",
    };
  }

  // ========================================
  // イベント所有者確認
  // ========================================

  const { data: event, error: eventError } =
    await supabase
      .from("events")
      .select("id")
      .eq("event_token", eventToken)
      .eq("user_id", user.id)
      .single();

  if (eventError || !event) {
    return {
      success: false,
      error: "イベントが見つかりません。",
    };
  }

  // ========================================
  // 写真取得
  // ========================================

  const { data: photo, error: photoError } =
    await supabase
      .from("photos")
      .select("id, storage_path")
      .eq("id", photoId)
      .eq("event_id", event.id)
      .single();

  if (photoError || !photo) {
    return {
      success: false,
      error: "写真が見つかりません。",
    };
  }

  // ========================================
  // Storage削除
  // ========================================

  const admin = createAdminClient();

  const { error: storageError } =
    await admin.storage
      .from("events")
      .remove([photo.storage_path]);

  if (storageError) {
    console.error(
      "photo storage delete error",
      storageError
    );

    return {
      success: false,
      error: "写真ファイルの削除に失敗しました。",
    };
  }

  // ========================================
  // DB削除
  // ========================================

  const { error: deleteError } =
    await admin
      .from("photos")
      .delete()
      .eq("id", photo.id)
      .eq("event_id", event.id);

  if (deleteError) {
    console.error(
      "photo database delete error",
      deleteError
    );

    return {
      success: false,
      error: "写真情報の削除に失敗しました。",
    };
  }

  return {
    success: true,
  };
}

// ========================================
// 写真一括削除
// ========================================

export async function deletePhotos(
  eventToken: string,
  photoIds: string[]
): Promise<DeletePhotoResult> {
  if (photoIds.length === 0) {
    return {
      success: false,
      error: "削除する写真が選択されていません。",
    };
  }

  const supabase = await createClient();

  // ----------------------------------------
  // ログイン確認
  // ----------------------------------------

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: "ログインが必要です。",
    };
  }

  // ----------------------------------------
  // イベント所有者確認
  // ----------------------------------------

  const { data: event, error: eventError } =
    await supabase
      .from("events")
      .select("id")
      .eq("event_token", eventToken)
      .eq("user_id", user.id)
      .single();

  if (eventError || !event) {
    return {
      success: false,
      error: "イベントが見つかりません。",
    };
  }

  // ----------------------------------------
  // 削除対象の写真取得
  // ----------------------------------------

  const { data: photos, error: photoError } =
    await supabase
      .from("photos")
      .select("id, storage_path")
      .eq("event_id", event.id)
      .in("id", photoIds);

  if (photoError) {
    console.error(
      "bulk photo fetch error",
      photoError
    );

    return {
      success: false,
      error: "写真情報の取得に失敗しました。",
    };
  }

  if (!photos || photos.length === 0) {
    return {
      success: false,
      error: "削除する写真が見つかりません。",
    };
  }

  // ----------------------------------------
  // Storageから一括削除
  // ----------------------------------------

  const storagePaths = photos.map(
    (photo) => photo.storage_path
  );

  const admin = createAdminClient();

  const { error: storageError } =
    await admin.storage
      .from("events")
      .remove(storagePaths);

  if (storageError) {
    console.error(
      "bulk photo storage delete error",
      storageError
    );

    return {
      success: false,
      error: "写真ファイルの削除に失敗しました。",
    };
  }

  // ----------------------------------------
  // DBから一括削除
  // ----------------------------------------

  const { error: deleteError } =
    await admin
      .from("photos")
      .delete()
      .eq("event_id", event.id)
      .in(
        "id",
        photos.map((photo) => photo.id)
      );

  if (deleteError) {
    console.error(
      "bulk photo database delete error",
      deleteError
    );

    return {
      success: false,
      error: "写真情報の削除に失敗しました。",
    };
  }

  return {
    success: true,
  };
}
"use client";

import { useState } from "react";

import { usePhoto } from "./usePhoto";
import { useUpload } from "./useUpload";

type Props = {
  eventId: string;
  eventToken: string;
};

export function usePhotoFlow({
  eventId,
  eventToken,
}: Props) {
  const photo = usePhoto();

  const upload = useUpload({
    eventId,
    eventToken,
  });

  const [status, setStatus] = useState<
    "idle" | "uploading" | "success" | "partial" | "error"
  >("idle");

  async function handleUpload(
    guestName = "ゲスト",
  ) {
    setStatus("uploading");

    const result =
      await upload.actions.upload({
        guestName,
        photos: photo.state.photos,
      });

    // ----------------------------------------
    // 完全成功
    // ----------------------------------------

    if (result.success) {
      setStatus("success");

      return result;
    }

    // ----------------------------------------
    // 一部成功
    // ----------------------------------------

    if (result.uploadedPhotos.length > 0) {
      setStatus("partial");

      return result;
    }

    // ----------------------------------------
    // 全失敗
    // ----------------------------------------

    setStatus("error");

    return result;
  }

  function clearPhotos() {
    photo.actions.clearPhotos();
    setStatus("idle");
  }

  function resetStatus() {
    setStatus("idle");
  }

  function clearSelectedPhotos() {
    photo.actions.clearPhotos();
  }

  return {
    state: {
      ...photo.state,
      uploading: upload.state.loading,
      error: upload.state.error,
      status,
    },

    actions: {
      // 初回選択
      setPhotos: photo.actions.setPhotos,

      // 追加選択
      addPhotos: photo.actions.addPhotos,

      // 1枚削除
      removePhoto: photo.actions.removePhoto,

      // 写真をクリア
      clearPhotos,

      // アップロード後に選択写真をクリア
      clearSelectedPhotos,

      // アップロード状態をリセット
      resetStatus,

      // アップロード
      upload: handleUpload,
    },
  };
}
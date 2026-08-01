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
    "idle" | "uploading" | "success" | "error"
  >("idle");


  async function handleUpload(
    guestName = "ゲスト"
  ) {
    setStatus("uploading");

    const success = await upload.actions.upload({
      guestName,
      photos: photo.state.photos,
    });

    if (!success) {
      setStatus("error");
      return false;
    }

    setStatus("success");
    return true;
  }


  function clearPhotos() {
    photo.actions.clearPhotos();
    setStatus("idle");
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

      // クリア
      clearPhotos,

      // upload
      upload: handleUpload,
    },
  };
}
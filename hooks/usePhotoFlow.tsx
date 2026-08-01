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

  async function handleUpload(guestName = "ゲスト") {
    setStatus("uploading");

    const success = await upload.actions.upload({
      guestName,
      capturedPhoto: photo.state.capturedPhoto,
    });

    if (!success) {
      setStatus("error");
      return false;
    }

    setStatus("success");
    return true;
  }

  function clearPhoto() {
    photo.actions.clearPhoto();
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
      setPhoto: photo.actions.setPhoto,
      clearPhoto,
      upload: handleUpload,
    },
  };
}
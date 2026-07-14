"use client";

import { useCamera } from "./useCamera";
import { useUpload } from "./useUpload";

type Props = {
  eventId: string;
  eventToken: string;
};

export function useCameraFlow({
  eventId,
  eventToken,
}: Props) {
  const camera = useCamera();

  const upload = useUpload({
    eventId,
    eventToken,
  });

  async function uploadPhoto() {
    const success =
      await upload.actions.upload({
        guestName: "ゲスト",
        capturedPhoto:
          camera.state.capturedPhoto,
      });

    if (!success) {
      alert(
        upload.state.error?.message ??
          "アップロードに失敗しました"
      );
      return;
    }

    alert("アップロードしました！");

    await camera.actions.retakePhoto();
  }

  return {
    state: {
      ...camera.state,

      uploading:
        upload.state.loading,
    },

    refs: camera.refs,

    actions: {
      takePhoto:
        camera.actions.takePhoto,

      retakePhoto:
        camera.actions.retakePhoto,

      upload: uploadPhoto,
    },
  };
}
"use client";

import { useCallback, useState } from "react";
import { uploadPhoto } from "@/services/photo.service";
import type { CapturedPhoto } from "@/types/camera";

type UseUploadProps = {
  eventId: string;
  eventToken: string;
};

type UploadParams = {
  guestName: string;
  capturedPhoto: CapturedPhoto | null;
};

export function useUpload({
  eventId,
  eventToken,
}: UseUploadProps) {
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<Error | null>(
    null
  );

  const upload = useCallback(
    async ({
      guestName,
      capturedPhoto,
    }: UploadParams) => {
      if (!capturedPhoto) return false;

      setLoading(true);
      setError(null);

      try {
        await uploadPhoto(
          eventId,
          eventToken,
          guestName,
          capturedPhoto.blob
        );

        return true;
      } catch (err) {
        const uploadError =
          err instanceof Error
            ? err
            : new Error(
                "画像保存に失敗しました"
              );

        setError(uploadError);

        return false;
      } finally {
        setLoading(false);
      }
    },
    [eventId, eventToken]
  );

  return {
    state: {
      loading,
      error,
    },

    actions: {
      upload,
    },
  };
}
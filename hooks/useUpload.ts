"use client";

import { useCallback, useState } from "react";
import { uploadPhoto } from "@/services/photo-upload.service";

type UseUploadProps = {
  eventId: string;
  eventToken: string;
};

type UploadParams = {
  guestName: string;
  photos: File[];
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
      photos,
    }: UploadParams) => {

      if (!photos || photos.length === 0) {
        return false;
      }


      setLoading(true);
      setError(null);


      try {

        await Promise.all(
          photos.map((file) =>
            uploadPhoto(
              eventId,
              eventToken,
              guestName,
              file
            )
          )
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
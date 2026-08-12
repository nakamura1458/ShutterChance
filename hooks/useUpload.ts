"use client";

import { useCallback, useState } from "react";

import { checkPhotoUploadLimit } from "@/actions/event.actions";
import { uploadPhoto } from "@/services/photo-upload.service";
import { compressImage } from "@/lib/image/compress-image";

type UseUploadProps = {
  eventId: string;
  eventToken: string;
};

type UploadParams = {
  guestName: string;
  photos: File[];
};

export type UploadResult = {
  success: boolean;
  uploadedPhotos: File[];
  failedPhotos: File[];
  error: Error | null;
};

export function useUpload({
  eventId,
  eventToken,
}: UseUploadProps) {
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<Error | null>(
    null,
  );

  const upload = useCallback(
    async ({guestName, photos}: UploadParams): Promise<UploadResult> => {
      // 写真なし
      if (!photos || photos.length === 0) {
        const uploadError = new Error(
          "アップロードする写真がありません。",
        );

        setError(uploadError);

        return {
          success: false,
          uploadedPhotos: [],
          failedPhotos: [],
          error: uploadError,
        };
      }

      setLoading(true);
      setError(null);

      try {
        // アップロード枚数チェック
        const limit =
          await checkPhotoUploadLimit(eventId, photos.length);

        // 上限超過
        if (!limit.allowed) {
          const message =
            limit.remaining === 0
              ? "このイベントの写真保存上限に達しています。"
              : `あと${limit.remaining}枚までアップロードできます。`;

          const uploadError = new Error(message);

          setError(uploadError);

          return {
            success: false,
            uploadedPhotos: [],
            failedPhotos: photos,
            error: uploadError,
          };
        }

        // アップロード
        const results = await Promise.allSettled(
          photos.map(async (file) => {
            // アップロード前に画像を圧縮
            const compressedFile = await compressImage(file);

            console.log(
              "画像圧縮:",
              file.name,
              `${(file.size / 1024 / 1024).toFixed(2)}MB`,
              "→",
              `${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`,
            );

            // 圧縮後のファイルをアップロード
            await uploadPhoto(
              eventId,
              eventToken,
              guestName,
              compressedFile,
            );

            // UI側には元のFileを返す
            return file;
          }),
        );

        // 成功 / 失敗を分離
        const uploadedPhotos: File[] = [];
        const failedPhotos: File[] = [];

        results.forEach((result, index) => {
          const file = photos[index];

          if (result.status === "fulfilled") {
            uploadedPhotos.push(file);
          } else {
            failedPhotos.push(file);

            console.error(
              "写真アップロード失敗:",
              file.name,
              result.reason,
            );
          }
        });

        // 全失敗
        if (uploadedPhotos.length === 0) {
          const uploadError = new Error(
            "写真のアップロードに失敗しました。",
          );

          setError(uploadError);

          return {
            success: false,
            uploadedPhotos: [],
            failedPhotos,
            error: uploadError,
          };
        }

        // 一部失敗
        if (failedPhotos.length > 0) {
          const uploadError = new Error(
            `${uploadedPhotos.length}枚の写真をアップロードしましたが、${failedPhotos.length}枚のアップロードに失敗しました。`,
          );

          setError(uploadError);

          return {
            success: false,
            uploadedPhotos,
            failedPhotos,
            error: uploadError,
          };
        }

        // 完全成功
        return {
          success: true,
          uploadedPhotos,
          failedPhotos: [],
          error: null,
        };
      } catch (err) {
        const uploadError =
          err instanceof Error
            ? err
            : new Error(
                "画像保存に失敗しました。",
              );

        setError(uploadError);

        return {
          success: false,
          uploadedPhotos: [],
          failedPhotos: photos,
          error: uploadError,
        };
      } finally {
        setLoading(false);
      }
    },
    [eventId, eventToken],
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
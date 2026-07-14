"use client";

import { useState } from "react";
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

  const [isUploading, setIsUploading] = useState(false);

  const [uploadError, setUploadError] =
    useState<string | null>(null);


  const upload = async ({
    guestName,
    capturedPhoto,
  }: UploadParams) => {

    if (!capturedPhoto) {
      return false;
    }


    try {

      setIsUploading(true);
      setUploadError(null);


      await uploadPhoto({
        eventId,
        eventToken,
        guestName,
        capturedPhoto,
      });


      return true;


    } catch (error) {

      console.error(error);

      setUploadError(
        "アップロードに失敗しました"
      );

      return false;


    } finally {

      setIsUploading(false);

    }
  };


  return {
    upload,
    isUploading,
    uploadError,
  };

}
"use client";

import FullscreenPreview from "./preview/FullscreenPreview";
import UploadComplete from "./upload/UploadComplete";
import { usePhotoFlow } from "@/hooks/usePhotoFlow";

type Props = {
  flow: ReturnType<typeof usePhotoFlow>;
  onUpload: () => void;
  uploadedPhotos: File[];
  onViewPhotos: () => void;
  onSelectPhoto: () => void;
};

export default function PhotoScreen({
  flow,
  onUpload,
  uploadedPhotos,
  onViewPhotos,
  onSelectPhoto,
}: Props) {

  if (flow.state.status === "success") {
    return (
      <UploadComplete
        photos={uploadedPhotos}
        onViewPhotos={onViewPhotos}
        onRetryUpload={onSelectPhoto}
      />
    );
  }


  if (!flow.state.photos.length) {
    return null;
  }

  return (
    <FullscreenPreview
      photos={flow.state.photos}
      uploading={flow.state.uploading}
      onClear={flow.actions.clearPhotos}
      onUpload={onUpload}
      onAddPhoto={onSelectPhoto}
    />
  );
}
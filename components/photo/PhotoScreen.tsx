"use client";

import UploadComplete from "./upload/UploadComplete";
import PhotoPreview from "./preview/PhotoPreview";

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
    <PhotoPreview
      photos={flow.state.photos}
      uploading={flow.state.uploading}
      actions={{
        onClear: flow.actions.clearPhotos,
        onAddPhoto: onSelectPhoto,
        onUpload,
        onRemovePhoto: flow.actions.removePhoto,
      }}
    />
  );
}
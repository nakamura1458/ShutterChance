"use client";

import FullscreenPreview from "./preview/FullscreenPreview";
import UploadComplete from "./upload/UploadComplete";
import { usePhotoFlow } from "@/hooks/usePhotoFlow";

type Props = {
  flow: ReturnType<typeof usePhotoFlow>;
  onUpload: () => void;
  onViewPhotos: () => void;
  onSelectPhoto: () => void;
};

export default function CameraScreen({
  flow,
  onUpload,
  onViewPhotos,
  onSelectPhoto,
}: Props) {
  if (flow.state.status === "success") {
    return (
      <UploadComplete
        onRetake={flow.actions.clearPhoto}
        onViewPhotos={onViewPhotos}
        onSelectPhoto={onSelectPhoto}
      />
    );
  }

  if (!flow.state.capturedPhoto) {
    return null;
  }

  return (
    <FullscreenPreview
      photo={flow.state.capturedPhoto}
      uploading={flow.state.uploading}
      onRetake={flow.actions.clearPhoto}
      onUpload={onUpload}
    />
  );
}
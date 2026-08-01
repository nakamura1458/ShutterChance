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

export default function PhotoScreen({
  flow,
  onUpload,
  onViewPhotos,
  onSelectPhoto,
}: Props) {

  console.log("PhotoScreen photos:", flow.state.photos);

  if (flow.state.status === "success") {
    return (
      <UploadComplete
        onRetake={flow.actions.clearPhotos}
        onViewPhotos={onViewPhotos}
        onSelectPhoto={onSelectPhoto}
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
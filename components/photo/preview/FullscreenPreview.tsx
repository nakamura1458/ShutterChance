"use client";

import PhotoPreview from "./PhotoPreview";

type Props = {
  photos: File[];
  uploading: boolean;
  onClear: () => void;
  onAddPhoto: () => void;
  onUpload: () => void;
  onRemovePhoto: (index: number) => void;
};

export default function FullscreenPreview({
  photos,
  uploading,
  onClear,
  onUpload,
  onAddPhoto,
  onRemovePhoto,
}: Props) {
  return (
    <div className="fixed inset-0 z-[200] h-dvh w-screen overflow-hidden bg-black">
      <PhotoPreview
        photos={photos}
        uploading={uploading}
        actions={{
          onClear,
          onUpload,
          onAddPhoto,
          onRemovePhoto,
        }}
      />
    </div>
  );
}
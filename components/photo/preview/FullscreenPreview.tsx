"use client";

import PhotoPreview from "./PhotoPreview";

type Props = {
  photos: File[];
  uploading: boolean;
  onClear: () => void;
  onAddPhoto: () => void;
  onUpload: () => void;
};

export default function FullscreenPreview({
  photos,
  uploading,
  onClear,
  onUpload,
  onAddPhoto,
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
        }}
      />
    </div>
  );
}
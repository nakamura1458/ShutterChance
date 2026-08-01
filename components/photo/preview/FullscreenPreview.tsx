"use client";

import PhotoPreview from "./PhotoPreview";
import type { CapturedPhoto } from "@/types/camera";

type Props = {
  photo: CapturedPhoto;
  uploading: boolean;
  onRetake: () => void;
  onUpload: () => void;
};

export default function FullscreenPreview({
  photo,
  uploading,
  onRetake,
  onUpload,
}: Props) {
  return (
    <div className="fixed inset-0 z-[200] h-dvh w-screen overflow-hidden bg-black">
        <PhotoPreview
            photo={photo}
            uploading={uploading}
            actions={{
            onRetake,
            onUpload,
            }}
        />
    </div>
  );
}
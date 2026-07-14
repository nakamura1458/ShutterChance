"use client";

import type { CapturedPhoto } from "@/types/camera";

type Props = {
  photo: CapturedPhoto;

  uploading: boolean;

  actions: {
    onRetake: () => void;
    onUpload: () => void;
  };
};

export default function PhotoPreview({
  photo,
  uploading,
  actions,
}: Props) {
  return (
    <div>
      <h3>撮影確認</h3>

      <img
        src={photo.previewUrl}
        alt="撮影した写真"
        className="w-full"
      />

      <div className="flex gap-3 mt-4">
        <button
          onClick={actions.onRetake}
        >
          🔄 撮り直す
        </button>

        <button
          onClick={actions.onUpload}
          disabled={uploading}
        >
          {uploading
            ? "アップロード中..."
            : "☁️ アップロード"}
        </button>
      </div>
    </div>
  );
}
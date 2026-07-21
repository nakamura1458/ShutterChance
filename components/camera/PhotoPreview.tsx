"use client";

import type { CapturedPhoto } from "@/types/camera";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

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
    <div className="flex h-full min-h-0 flex-col bg-black">

      <div className="min-h-0 flex-1 flex items-center justify-center overflow-hidden">
        <img
          src={photo.previewUrl}
          alt="撮影した写真"
          className="h-full w-full object-contain scale-105"
        />
      </div>

      <div className="flex gap-3 border-t border-white/10 bg-black/80 p-4 backdrop-blur">
        <Button
          variant="secondary"
          className="flex-1 h-14"
          onClick={actions.onRetake}
          disabled={uploading}
        >
          🔄 撮り直す
        </Button>

        <Button
          className="flex-1 h-14"
          onClick={actions.onUpload}
          disabled={uploading}
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              送信中...
            </>
          ) : (
            <>☁️ 写真を送る</>
          )}
        </Button>
      </div>
    </div>
  );
}
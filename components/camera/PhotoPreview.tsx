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
    <div className="flex flex-col gap-6">

      <div>
        <h3 className="text-xl font-bold">
          撮影確認
        </h3>

        <p className="text-sm text-muted-foreground mt-1">
          この写真をイベントに共有します
        </p>
      </div>


      <div className="overflow-hidden rounded-xl">
        <img
          src={photo.previewUrl}
          alt="撮影した写真"
          className="
            w-full
            aspect-[3/4]
            object-cover
          "
        />
      </div>


      <div className="flex gap-3">

        <Button
          variant="outline"
          className="flex-1 h-12"
          onClick={
            actions.onRetake
          }
          disabled={
            uploading
          }
        >
          🔄 撮り直す
        </Button>


        <Button
          className="flex-1 h-12"
          onClick={
            actions.onUpload
          }
          disabled={
            uploading
          }
        >

          {
            uploading ? (
              <>
                <Loader2
                  className="mr-2 h-4 w-4 animate-spin"
                />

                送信中...
              </>
            ) : (
              <>
                ☁️ 写真を送る
              </>
            )
          }

        </Button>

      </div>

    </div>
  );
}
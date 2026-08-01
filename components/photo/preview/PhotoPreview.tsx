"use client";

import { Button } from "@/components/ui/button";
import { Loader2, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  photos: File[];
  uploading: boolean;
  actions: {
    onClear: () => void;
    onAddPhoto: () => void;
    onUpload: () => void;
  };
};

export default function PhotoPreview({
  photos,
  uploading,
  actions,
}: Props) {

  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] =
    useState<number | null>(null);


  useEffect(() => {
    const urls = photos.map((file) =>
      URL.createObjectURL(file)
    );

    setPreviewUrls(urls);

    return () => {
      urls.forEach((url) =>
        URL.revokeObjectURL(url)
      );
    };
  }, [photos]);


  const showPrevious = () => {
    if (selectedIndex === null) return;

    setSelectedIndex(
      selectedIndex === 0
        ? photos.length - 1
        : selectedIndex - 1
    );
  };


  const showNext = () => {
    if (selectedIndex === null) return;

    setSelectedIndex(
      selectedIndex === photos.length - 1
        ? 0
        : selectedIndex + 1
    );
  };


  return (
    <div className="flex h-full min-h-0 flex-col bg-black">


      {/* 写真エリア */}
      <div className="min-h-0 flex-1 overflow-auto p-4">

        <div className="mb-3 text-sm text-white/80">
          {photos.length}枚選択中
        </div>


        <div className="grid grid-cols-3 gap-2">

          {previewUrls.map((url, index) => (
            <button
              key={index}
              type="button"
              onClick={() =>
                setSelectedIndex(index)
              }
            >
              <img
                src={url}
                alt={`選択写真 ${index + 1}`}
                className="
                  aspect-square
                  w-full
                  rounded-lg
                  object-cover
                  active:opacity-70
                "
              />
            </button>
          ))}

        </div>

      </div>



      {/* 拡大表示 */}
      {selectedIndex !== null && (
        <div
          className="
            fixed
            inset-0
            z-[300]
            flex
            items-center
            justify-center
            bg-black
          "
        >

          <button
            className="absolute right-4 top-4 text-white"
            onClick={() =>
              setSelectedIndex(null)
            }
          >
            <X size={32}/>
          </button>


          <img
            src={previewUrls[selectedIndex]}
            className="
              max-h-[85vh]
              max-w-full
              object-contain
            "
          />


          {photos.length > 1 && (
            <>
              <button
                className="
                  absolute
                  left-4
                  text-white
                "
                onClick={showPrevious}
              >
                <ChevronLeft size={40}/>
              </button>


              <button
                className="
                  absolute
                  right-4
                  text-white
                "
                onClick={showNext}
              >
                <ChevronRight size={40}/>
              </button>
            </>
          )}

        </div>
      )}



      {/* 下部ボタン */}
      <div
        className="
          grid
          grid-cols-3
          gap-2
          border-t
          border-white/10
          bg-black/80
          p-4
          backdrop-blur
        "
      >

        <Button
          type="button"
          variant="secondary"
          className="h-14"
          onClick={actions.onClear}
          disabled={uploading}
        >
          🗑
          <span className="ml-1">
            クリア
          </span>
        </Button>


        <Button
          type="button"
          variant="secondary"
          className="h-14"
          onClick={actions.onAddPhoto}
          disabled={uploading}
        >
          ＋追加
        </Button>


        <Button
          type="button"
          className="h-14"
          onClick={actions.onUpload}
          disabled={uploading}
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
              送信
            </>
          ) : (
            <>☁️送信</>
          )}
        </Button>

      </div>

    </div>
  );
}
"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import FullscreenPreview from "@/components/gallery/FullscreenPreview";

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
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

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
      <div className="min-h-0 flex-1 overflow-auto">

        {/* Header */}
        <div
          className="
            sticky
            top-0
            z-20
            bg-black/80
            px-5
            py-5
            backdrop-blur-xl
          "
        >
          <h2
            className="
              text-xl
              font-semibold
              tracking-tight
              text-white
            "
          >
            写真を確認
          </h2>

          <p
            className="
              mt-1
              text-sm
              text-white/60
            "
          >
            {photos.length}枚の写真
          </p>
        </div>


        {/* Photo Grid */}
        <div
          className="
            grid
            grid-cols-3
            gap-1
            px-1
            pb-6
          "
        >

          {previewUrls.map((url, index) => (

            <motion.button
              key={index}
              type="button"
              initial={{
                opacity: 0,
                scale: 0.85,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                duration: 0.25,
                delay: index * 0.04,
              }}
              className="
                overflow-hidden
                rounded-xl
                active:scale-95
                transition-transform
              "
              onClick={() => {
                setSelectedIndex(index);
              }}
            >

              <img
                src={url}
                alt={`選択写真 ${index + 1}`}
                className="
                  aspect-square
                  w-full
                  object-cover
                "
              />

            {/* </button> */}
            </motion.button>

          ))}

        </div>

      </div>


      {/* 拡大表示 */}
      {selectedIndex !== null && (
        <FullscreenPreview
          photos={previewUrls}
          selectedIndex={selectedIndex}
          onClose={() =>
            setSelectedIndex(null)
          }
          onNext={showNext}
          onPrevious={showPrevious}
        />
      )}


      {/* 下部アクション */}
      <div
        className="
          space-y-3
          border-t
          border-white/10
          bg-black/80
          p-4
          pb-6
          backdrop-blur-xl
        "
      >

        {/* 写真追加 */}
        <Button
          type="button"
          variant="ghost"
          className="
            h-12
            w-full
            rounded-xl
            text-white
            hover:bg-white/10
          "
          onClick={actions.onAddPhoto}
          disabled={uploading}
        >
          ＋ 写真を追加
        </Button>


        {/* 共有ボタン */}
        <motion.button
          type="button"
          className="
            flex
            h-14
            w-full
            items-center
            justify-center
            rounded-2xl
            bg-primary
            text-base
            font-semibold
            text-primary-foreground
            shadow-lg
            disabled:opacity-60
          "
          whileTap={{
            scale: 0.96,
          }}
          transition={{
            duration:0.15,
          }}
          onClick={actions.onUpload}
          disabled={uploading}
        >

          {uploading ? (
            <>
              <Loader2
                className="
                  mr-2
                  h-5
                  w-5
                  animate-spin
                "
              />

              写真を届けています...
            </>
          ) : (
            <>
              ✨ 写真を共有する
            </>
          )}

        </motion.button>


        {/* 選択解除 */}
        <button
          type="button"
          className="
            w-full
            text-center
            text-sm
            text-white/50
            transition
            hover:text-white/80
          "
          onClick={actions.onClear}
          disabled={uploading}
        >
          選択を解除
        </button>


      </div>

    </div>
  );
}
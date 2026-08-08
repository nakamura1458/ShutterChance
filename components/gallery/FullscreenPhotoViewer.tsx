"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Share,
  X,
} from "lucide-react";
import type { PhotoListItem } from "@/types/photo";
import { savePhotos } from "@/lib/utils/savePhotos";

type Props = {
  photos: PhotoListItem[];
  currentIndex: number;
  onPrevious: () => void;
  onNext: () => void;
  onClose: () => void;
};

export default function FullscreenPhotoViewer({
  photos,
  currentIndex,
  onPrevious,
  onNext,
  onClose,
}: Props) {
  const photo = photos[currentIndex];

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  // 1 = 次の写真
  // -1 = 前の写真
  const direction = useRef<1 | -1>(1);

  // キーボード操作
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          direction.current = -1;
          onPrevious();
          break;

        case "ArrowRight":
          direction.current = 1;
          onNext();
          break;

        case "Escape":
          onClose();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onPrevious, onNext, onClose]);

  // 前の写真
  const handlePrevious = () => {
    direction.current = -1;
    onPrevious();
  };

  // 次の写真
  const handleNext = () => {
    direction.current = 1;
    onNext();
  };

  // スワイプ開始
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  // スワイプ終了
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (
      touchStartX.current === null ||
      touchStartY.current === null
    ) {
      return;
    }

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const diffX = touchEndX - touchStartX.current;
    const diffY = touchEndY - touchStartY.current;

    touchStartX.current = null;
    touchStartY.current = null;

    // 縦方向の移動が大きければ無視
    if (Math.abs(diffY) > Math.abs(diffX)) {
      return;
    }

    // 小さな移動は無視
    if (Math.abs(diffX) < 50) {
      return;
    }

    // 左スワイプ → 次
    if (diffX < 0) {
      handleNext();
      return;
    }

    // 右スワイプ → 前
    handlePrevious();
  };

  // 写真保存
  const handleSavePhoto = async () => {
    await savePhotos([photo]);
  };

  return (
    <div
      className="
        fixed
        inset-0
        z-[9999]
        flex
        bg-black
      "
      onClick={onClose}
    >
      <div
        className="
          relative
          flex
          h-full
          w-full
          flex-col
          overflow-hidden
          bg-black
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header
          className="
            relative
            z-30
            flex
            h-16
            shrink-0
            items-center
            justify-between
            border-b
            border-white/10
            bg-black/80
            px-4
            backdrop-blur
          "
        >
          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            className="
              rounded-full
              p-2
              text-white
              transition
              hover:bg-white/10
              active:bg-white/20
            "
            aria-label="閉じる"
          >
            <X size={24} />
          </button>

          {/* Guest name / counter */}
          <div className="flex-1 px-4 text-center">
            <p className="truncate font-semibold text-white">
              {photo.guest_name || "ゲスト"}
            </p>

            <p className="text-xs text-zinc-400">
              {currentIndex + 1} / {photos.length}
            </p>
          </div>

          {/* Save */}
          <button
            type="button"
            onClick={handleSavePhoto}
            className="
              flex
              items-center
              gap-1
              rounded-full
              p-2
              text-white
              transition
              hover:bg-white/10
              active:bg-white/20
            "
            aria-label="写真を保存"
          >
            <Share size={20} />

            <span className="text-sm">
              保存
            </span>
          </button>
        </header>

        {/* Photo Area */}
        <div
          className="
            relative
            flex-1
            overflow-hidden
            bg-black
            touch-pan-y
          "
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Previous */}
          {currentIndex > 0 && (
            <button
              type="button"
              onClick={handlePrevious}
              className="
                absolute
                left-3
                top-1/2
                z-20
                -translate-y-1/2
                rounded-full
                bg-black/50
                p-3
                text-white
                transition
                hover:bg-black/70
                active:bg-black/80
              "
              aria-label="前の写真"
            >
              <ChevronLeft size={28} />
            </button>
          )}

          {/* Photo */}
          <div className="relative h-full w-full overflow-hidden">
            <AnimatePresence
              initial={false}
              custom={direction.current}
              mode="popLayout"
            >
              <motion.div
                key={photo.id}
                custom={direction.current}
                variants={{
                  enter: (direction: number) => ({
                    x: direction > 0 ? "100%" : "-100%",
                    opacity: 1,
                  }),

                  center: {
                    x: 0,
                    opacity: 1,
                  },

                  exit: (direction: number) => ({
                    x: direction > 0 ? "-100%" : "100%",
                    opacity: 1,
                  }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: {
                    type: "tween",
                    duration: 0.25,
                    ease: "easeOut",
                  },
                }}
                className="
                  absolute
                  inset-0
                  flex
                  h-full
                  w-full
                  items-center
                  justify-center
                "
              >
                <img
                  src={photo.image_url}
                  alt={photo.guest_name ?? "photo"}
                  draggable={false}
                  className="
                    h-full
                    w-full
                    object-contain
                    select-none
                  "
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Next */}
          {currentIndex < photos.length - 1 && (
            <button
              type="button"
              onClick={handleNext}
              className="
                absolute
                right-3
                top-1/2
                z-20
                -translate-y-1/2
                rounded-full
                bg-black/50
                p-3
                text-white
                transition
                hover:bg-black/70
                active:bg-black/80
              "
              aria-label="次の写真"
            >
              <ChevronRight size={28} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
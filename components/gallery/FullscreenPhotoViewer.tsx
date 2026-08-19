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
import LikeButton from "./LikeButton";
import ZoomablePhoto from "./ZoomablePhoto";

type Props = {
  photos: PhotoListItem[];
  currentIndex: number;
  eventToken: string;
  onPrevious: () => void;
  onNext: () => void;
  onClose: () => void;
};

export default function FullscreenPhotoViewer({
  photos,
  currentIndex,
  eventToken,
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

  // ========================================
  // Keyboard
  // ========================================

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

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [onPrevious, onNext, onClose]);

  // ========================================
  // Navigation
  // ========================================

  const handlePrevious = () => {
    direction.current = -1;
    onPrevious();
  };

  const handleNext = () => {
    direction.current = 1;
    onNext();
  };

  // ========================================
  // Touch
  // ========================================

  const handleTouchStart = (
    e: React.TouchEvent
  ) => {
    touchStartX.current =
      e.touches[0].clientX;

    touchStartY.current =
      e.touches[0].clientY;
  };

  const handleTouchEnd = (
    e: React.TouchEvent
  ) => {
    if (
      touchStartX.current === null ||
      touchStartY.current === null
    ) {
      return;
    }

    const touchEndX =
      e.changedTouches[0].clientX;

    const touchEndY =
      e.changedTouches[0].clientY;

    const diffX =
      touchEndX - touchStartX.current;

    const diffY =
      touchEndY - touchStartY.current;

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

    if (diffX < 0) {
      handleNext();
    } else {
      handlePrevious();
    }
  };

  // ========================================
  // Save
  // ========================================

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
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        {/* ======================================
            Header
        ====================================== */}

        <header
          className="
            relative
            z-30
            flex
            h-16
            shrink-0
            items-center
            justify-between
            bg-black/80
            px-4
            backdrop-blur-xl
          "
        >
          {/* Close */}

          <button
            type="button"
            onClick={onClose}
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              bg-white/10
              text-white
              transition
              hover:bg-white/20
              active:scale-90
            "
            aria-label="閉じる"
          >
            <X size={22} />
          </button>

          {/* Counter */}

          <div
            className="
              rounded-full
              bg-white/10
              px-4
              py-2
              text-sm
              font-medium
              text-white/90
              backdrop-blur-xl
            "
          >
            {currentIndex + 1}
            {" / "}
            {photos.length}
          </div>

          {/* Save */}

          <button
            type="button"
            onClick={handleSavePhoto}
            className="
              flex
              items-center
              gap-1.5
              rounded-full
              bg-white/10
              px-3
              py-2
              text-white
              transition
              hover:bg-white/20
              active:scale-95
            "
            aria-label="写真を保存"
          >
            <Share size={18} />

            <span className="text-sm">
              保存
            </span>
          </button>
        </header>

        {/* ======================================
            Photo Area
        ====================================== */}

        {/* <div
          className="
            relative
            flex-1
            overflow-hidden
            bg-black
            touch-pan-y
          "
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        > */}
        <div
          className="
            relative
            flex-1
            overflow-hidden
            bg-black
          "
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
                flex
                h-11
                w-11
                -translate-y-1/2
                items-center
                justify-center
                rounded-full
                bg-black/50
                text-white
                backdrop-blur-sm
                transition
                hover:bg-black/70
                active:scale-90
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
                  enter: (
                    direction: number
                  ) => ({
                    x:
                      direction > 0
                        ? "100%"
                        : "-100%",
                    opacity: 1,
                  }),

                  center: {
                    x: 0,
                    opacity: 1,
                  },

                  exit: (
                    direction: number
                  ) => ({
                    x:
                      direction > 0
                        ? "-100%"
                        : "100%",
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
                {/* <img
                  src={photo.image_url}
                  alt={
                    photo.guest_name ??
                    "photo"
                  }
                  draggable={false}
                  className="
                    h-full
                    w-full
                    select-none
                    object-contain
                  "
                /> */}
                <ZoomablePhoto
                  src={photo.image_url}
                  alt={
                    photo.guest_name ??
                    "photo"
                  }
                  onSwipeLeft={handleNext}
                  onSwipeRight={handlePrevious}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Next */}

          {currentIndex <
            photos.length - 1 && (
            <button
              type="button"
              onClick={handleNext}
              className="
                absolute
                right-3
                top-1/2
                z-20
                flex
                h-11
                w-11
                -translate-y-1/2
                items-center
                justify-center
                rounded-full
                bg-black/50
                text-white
                backdrop-blur-sm
                transition
                hover:bg-black/70
                active:scale-90
              "
              aria-label="次の写真"
            >
              <ChevronRight size={28} />
            </button>
          )}

          {/* ======================================
              Photo Info
          ====================================== */}

          <div
            className="
              absolute
              bottom-5
              left-4
              right-4
              z-20
              flex
              items-center
              justify-between
              gap-3
            "
          >
            {/* Guest name */}

            <div
              className="
                max-w-[60%]
                rounded-full
                bg-white/95
                px-3
                py-1.5
                text-sm
                font-medium
                text-zinc-900
                shadow-lg
                backdrop-blur
              "
            >
              {photo.guest_name ||
                "ゲスト"}
            </div>

            {/* Like */}

            <LikeButton
              eventToken={eventToken}
              photoId={photo.id}
            />
          </div>
        </div>

        {/* ======================================
            Bottom Navigation
        ====================================== */}

        <div
          className="
            flex
            h-20
            shrink-0
            items-center
            justify-between
            bg-black
            px-6
            pb-3
          "
        >
          {photos.length > 1 ? (
            <>
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-full
                  bg-white/10
                  text-white
                  transition
                  hover:bg-white/20
                  active:scale-90
                  disabled:opacity-20
                "
                aria-label="前の写真"
              >
                <ChevronLeft size={26} />
              </button>

              <p
                className="
                  text-xs
                  text-white/40
                "
              >
                スワイプで写真を切り替え
              </p>

              <button
                type="button"
                onClick={handleNext}
                disabled={
                  currentIndex ===
                  photos.length - 1
                }
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-full
                  bg-white/10
                  text-white
                  transition
                  hover:bg-white/20
                  active:scale-90
                  disabled:opacity-20
                "
                aria-label="次の写真"
              >
                <ChevronRight size={26} />
              </button>
            </>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}
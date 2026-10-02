"use client";

import {
  AnimatePresence,
  motion,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Share,
  Trash2,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

import type { PhotoListItem } from "@/types/photo";
import { savePhotos } from "@/lib/utils/savePhotos";
import LikeButton from "./LikeButton";
import ZoomablePhoto from "./ZoomablePhoto";

import { deletePhoto } from "@/app/dashboard/events/[eventToken]/photos/actions";

type Props = {
  photos: PhotoListItem[];
  currentIndex: number;
  eventToken: string;
  organizerMode?: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onClose: () => void;
};

export default function FullscreenPhotoViewer({
  photos,
  currentIndex,
  eventToken,
  organizerMode = false,
  onPrevious,
  onNext,
  onClose,
}: Props) {
  const router = useRouter();

  const photo = photos[currentIndex];

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  // 1 = 次の写真
  // -1 = 前の写真
  const direction = useRef<1 | -1>(1);

  // ========================================
  // Delete
  // ========================================

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] =
    useState(false);

  const [isDeleting, setIsDeleting] =
    useState(false);

  const [deleteError, setDeleteError] =
    useState<string | null>(null);

  // ========================================
  // Keyboard
  // ========================================

  useEffect(() => {
    const handleKeyDown = (
      e: KeyboardEvent
    ) => {
      // 削除確認中はキーボード操作を無効化
      if (isDeleteConfirmOpen) {
        if (e.key === "Escape" && !isDeleting) {
          setIsDeleteConfirmOpen(false);
          setDeleteError(null);
        }

        return;
      }

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
  }, [
    onPrevious,
    onNext,
    onClose,
    isDeleteConfirmOpen,
    isDeleting,
  ]);

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
    if (
      Math.abs(diffY) >
      Math.abs(diffX)
    ) {
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

  // ========================================
  // Delete
  // ========================================

  const handleOpenDeleteConfirm = () => {
    setDeleteError(null);
    setIsDeleteConfirmOpen(true);
  };

  const handleCloseDeleteConfirm = () => {
    if (isDeleting) {
      return;
    }

    setIsDeleteConfirmOpen(false);
    setDeleteError(null);
  };

  const handleDeletePhoto = async () => {
    if (!organizerMode || isDeleting) {
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    try {
      const result = await deletePhoto(
        eventToken,
        photo.id
      );

      if (!result.success) {
        setDeleteError(
          result.error ??
            "写真の削除に失敗しました。"
        );
        return;
      }

      // Viewerを閉じる
      onClose();

      // サーバー側の写真一覧・枚数を再取得
      router.refresh();
    } catch (error) {
      console.error(
        "delete photo error",
        error
      );

      setDeleteError(
        "写真の削除に失敗しました。"
      );
    } finally {
      setIsDeleting(false);
    }
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

          {/* Actions */}

          <div className="flex items-center gap-2">
            {/* Delete */}

            {organizerMode && (
              <button
                type="button"
                onClick={
                  handleOpenDeleteConfirm
                }
                className="
                  flex
                  items-center
                  gap-1.5
                  rounded-full
                  bg-red-500/90
                  px-3
                  py-2
                  text-white
                  transition
                  hover:bg-red-500
                  active:scale-95
                "
                aria-label="写真を削除"
              >
                <Trash2 size={17} />

                <span className="text-sm">
                  削除
                </span>
              </button>
            )}

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
          </div>
        </header>

        {/* ======================================
            Photo Area
        ====================================== */}

        <div
          className="
            relative
            flex-1
            overflow-hidden
            bg-black
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
                <ZoomablePhoto
                  src={photo.image_url}
                  alt={
                    photo.guest_name ??
                    "photo"
                  }
                  onSwipeLeft={handleNext}
                  onSwipeRight={
                    handlePrevious
                  }
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
                onClick={
                  handlePrevious
                }
                disabled={
                  currentIndex === 0
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

        {/* ======================================
            Delete Confirmation
        ====================================== */}

        <AnimatePresence>
          {isDeleteConfirmOpen && (
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              className="
                absolute
                inset-0
                z-50
                flex
                items-center
                justify-center
                bg-black/70
                px-5
                backdrop-blur-sm
              "
              onClick={
                handleCloseDeleteConfirm
              }
            >
              <motion.div
                initial={{
                  scale: 0.96,
                  opacity: 0,
                }}
                animate={{
                  scale: 1,
                  opacity: 1,
                }}
                exit={{
                  scale: 0.96,
                  opacity: 0,
                }}
                transition={{
                  duration: 0.15,
                }}
                className="
                  w-full
                  max-w-sm
                  rounded-2xl
                  bg-white
                  p-6
                  shadow-2xl
                "
                onClick={(e) =>
                  e.stopPropagation()
                }
              >
                {/* Icon */}

                <div
                  className="
                    mx-auto
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-full
                    bg-red-50
                  "
                >
                  <Trash2
                    className="
                      h-5
                      w-5
                      text-red-500
                    "
                  />
                </div>

                {/* Title */}

                <h2
                  className="
                    mt-4
                    text-center
                    text-lg
                    font-semibold
                    text-gray-900
                  "
                >
                  この写真を削除しますか？
                </h2>

                {/* Description */}

                <p
                  className="
                    mt-2
                    text-center
                    text-sm
                    leading-6
                    text-gray-500
                  "
                >
                  削除した写真は
                  <br />
                  復元できません。
                </p>

                {/* Error */}

                {deleteError && (
                  <p
                    className="
                      mt-4
                      rounded-xl
                      bg-red-50
                      px-4
                      py-3
                      text-center
                      text-sm
                      text-red-600
                    "
                  >
                    {deleteError}
                  </p>
                )}

                {/* Buttons */}

                <div
                  className="
                    mt-6
                    grid
                    grid-cols-2
                    gap-3
                  "
                >
                  <button
                    type="button"
                    onClick={
                      handleCloseDeleteConfirm
                    }
                    disabled={isDeleting}
                    className="
                      rounded-xl
                      border
                      border-gray-200
                      bg-white
                      px-4
                      py-3
                      text-sm
                      font-medium
                      text-gray-700
                      transition
                      hover:bg-gray-50
                      active:scale-[0.98]
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    キャンセル
                  </button>

                  <button
                    type="button"
                    onClick={
                      handleDeletePhoto
                    }
                    disabled={isDeleting}
                    className="
                      inline-flex
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      bg-red-500
                      px-4
                      py-3
                      text-sm
                      font-medium
                      text-white
                      transition
                      hover:bg-red-600
                      active:scale-[0.98]
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  >
                    {isDeleting ? (
                      <>
                        <span
                          className="
                            h-4
                            w-4
                            animate-spin
                            rounded-full
                            border-2
                            border-white/40
                            border-t-white
                          "
                        />
                        削除中...
                      </>
                    ) : (
                      <>
                        <Trash2 size={16} />
                        削除する
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
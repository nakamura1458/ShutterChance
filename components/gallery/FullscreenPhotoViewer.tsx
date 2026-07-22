"use client";

import { useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  X,
} from "lucide-react";
import type { PhotoListItem } from "@/types/photo";

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          onPrevious();
          break;
        case "ArrowRight":
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

  const handleDownload = async () => {
    try {
      const response = await fetch(photo.image_url);
      const blob = await response.blob();

      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${photo.guest_name || "photo"}.jpg`;
      a.click();

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className="
        fixed inset-0
        z-[9999]
        flex items-center justify-center
        bg-black/40
        backdrop-blur-sm
        p-4
      "
      onClick={onClose}
    >
      <div
        className="
          relative
          w-full
          max-w-[560px]
          h-[90vh]
          bg-zinc-950
          rounded-3xl
          overflow-hidden
          shadow-2xl
          border border-white/10
          flex flex-col
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header
          className="
            h-16
            shrink-0
            flex
            items-center
            justify-between
            px-4
            border-b
            border-white/10
            bg-zinc-950
          "
        >
          <button
            onClick={onClose}
            className="rounded-full p-2 text-white hover:bg-white/10 transition"
          >
            <X size={24} />
          </button>

          <div className="flex-1 px-4 text-center">
            <p className="text-white font-semibold truncate">
              {photo.guest_name || "ゲスト"}
            </p>

            <p className="text-xs text-zinc-400">
              {currentIndex + 1} / {photos.length}
            </p>
          </div>

          <button
            onClick={handleDownload}
            className="rounded-full p-2 text-white hover:bg-white/10 transition"
          >
            <Download size={22} />
          </button>
        </header>

        {/* Photo */}
        <div
          className="
            relative
            flex-1
            flex
            items-center
            justify-center
            overflow-hidden
            bg-black
          "
        >
          {currentIndex > 0 && (
            <button
              onClick={onPrevious}
              className="
                absolute
                left-3
                z-20
                rounded-full
                bg-black/50
                p-3
                text-white
                hover:bg-black/70
                transition
              "
            >
              <ChevronLeft size={28} />
            </button>
          )}

          <img
            src={photo.image_url}
            alt={photo.guest_name ?? "photo"}
            draggable={false}
            className="
              max-w-full
              max-h-full
              object-contain
              select-none
            "
          />

          {currentIndex < photos.length - 1 && (
            <button
              onClick={onNext}
              className="
                absolute
                right-3
                z-20
                rounded-full
                bg-black/50
                p-3
                text-white
                hover:bg-black/70
                transition
              "
            >
              <ChevronRight size={28} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
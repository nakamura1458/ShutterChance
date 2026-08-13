"use client";

import type { PhotoListItem } from "@/types/photo";
import LikeButton from "./LikeButton";

type Props = {
  photo: PhotoListItem;
  eventToken: string;
  onClick: () => void;
  selectionMode?: boolean;
  selected?: boolean;
};

export default function PhotoCard({
  photo,
  eventToken,
  onClick,
  selectionMode = false,
  selected = false,
}: Props) {
  return (
    <div
      className="
        group
        relative
        aspect-square
        overflow-hidden
        rounded-sm
        bg-muted
      "
    >
      {/* 写真クリック部分 */}
      <button
        type="button"
        onClick={onClick}
        className="
          absolute
          inset-0
          h-full
          w-full
        "
      >
        <img
          src={photo.image_url}
          alt="uploaded photo"
          className={`
            h-full
            w-full
            object-cover
            transition-all
            duration-300
            ${
              selected
                ? "scale-95"
                : "group-hover:scale-110"
            }
          `}
        />
      </button>

      {/* ========================================
          選択状態
      ======================================== */}

      {selectionMode && (
        <div
          className={`
            pointer-events-none
            absolute
            top-2
            left-2
            z-20
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-full
            border-2
            text-sm
            font-bold
            transition-all
            duration-200

            ${
              selected
                ? `
                    scale-110
                    border-blue-600
                    bg-blue-600
                    text-white
                  `
                : `
                    border-white
                    bg-black/30
                    text-transparent
                  `
            }
          `}
        >
          ✓
        </div>
      )}

      {selectionMode && selected && (
        <div className="pointer-events-none absolute inset-0 z-10 bg-black/30" />
      )}

      {/* ========================================
          下部オーバーレイ
      ======================================== */}

      <div
        className={`
          pointer-events-none
          absolute
          inset-0
          z-10
          flex
          items-end
          justify-between
          p-2
          transition
          ${
            selectionMode
              ? "bg-transparent opacity-100"
              : "bg-black/0 opacity-0 group-hover:bg-black/30 group-hover:opacity-100"
          }
        `}
      >
        <p
          className="
            rounded-full
            bg-white/90
            px-2
            py-1
            text-xs
            font-medium
            text-zinc-900
            shadow-sm
          "
        >
          {photo.guest_name}
        </p>
      </div>

      {/* ========================================
          Like
      ======================================== */}

      {!selectionMode && (
        <div
          className="
            absolute
            bottom-1
            right-1
            z-30
          "
        >
          <LikeButton
            eventToken={eventToken}
            photoId={photo.id}
          />
        </div>
      )}
    </div>
  );
}
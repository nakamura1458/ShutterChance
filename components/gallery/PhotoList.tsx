"use client";

import { useState } from "react";
import {
  CheckSquare,
  Square,
  X,
} from "lucide-react";
import PhotoCard from "./PhotoCard";
import FullscreenPhotoViewer from "./FullscreenPhotoViewer";
import type { PhotoListItem } from "@/types/photo";
import { savePhotos } from "@/lib/utils/savePhotos";

type Props = {
  photos: PhotoListItem[];
};

export default function PhotoList({ photos }: Props) {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const [selectionMode, setSelectionMode] = useState(false);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [isSaving, setIsSaving] = useState(false);

  const toggleSelection = (photoId: string) => {
    setSelectedIds((prev) =>
      prev.includes(photoId)
        ? prev.filter((id) => id !== photoId)
        : [...prev, photoId]
    );
  };

  return (
    <section
      id="photo-list"
      className={`
        space-y-4
        ${selectionMode ? "pb-24" : ""}
      `}
    >
      <div className="flex items-center justify-between px-1">

        {selectionMode ? (
          <>
            {/* 選択モード */}

            <button
              onClick={() => {
                setSelectedIds([]);
                setSelectionMode(false);
              }}
              className="
                text-sm
                font-medium
                text-muted-foreground
              "
            >
              キャンセル
            </button>


            <p
              className="
                text-sm
                font-semibold
              "
            >
              {selectedIds.length}枚選択中
            </p>

            <button
              onClick={() => {
                if (selectedIds.length > 0) {
                  // 1枚でも選択されていたら全解除
                  setSelectedIds([]);
                } else {
                  // 0枚なら全選択
                  setSelectedIds(
                    photos.map((photo) => photo.id)
                  );
                }
              }}
              className="
                flex
                items-center
                gap-1
                text-sm
                font-medium
                text-blue-600
              "
            >
              {selectedIds.length > 0 ? (
                <>
                  <Square size={16} />
                  すべて解除
                </>
              ) : (
                <>
                  <CheckSquare size={16} />
                  すべて選択
                </>
              )}
            </button>

          </>
        ) : (

          <>
            {/* 通常モード */}

            <h2 className="text-xl font-bold">
              📸 Gallery
            </h2>

            <div className="flex items-center gap-4">

              <p
                className="
                  text-sm
                  text-muted-foreground
                "
              >
                {photos.length} Photos
              </p>


              <button
                onClick={() => {
                  setSelectionMode(true);
                }}
                className="
                  flex
                  items-center
                  gap-1
                  text-sm
                  font-medium
                  text-blue-600
                "
              >
                <CheckSquare size={16} />
                選択
              </button>

            </div>

          </>
        )}

      </div>

      {photos.length === 0 ? (
        <p className="text-muted-foreground">
          まだ写真がありません
        </p>
      ) : (
        <div
          className="
            grid
            grid-cols-3
            gap-1
            sm:gap-2
          "
        >
          {photos.map((photo, index) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              selectionMode={selectionMode}
              selected={selectedIds.includes(photo.id)}
              onClick={() => {
                if (selectionMode) {
                  toggleSelection(photo.id);
                } else {
                  setCurrentIndex(index);
                }
              }}
            />
          ))}
        </div>
      )}

      {currentIndex !== null && (
        <FullscreenPhotoViewer
          photos={photos}
          currentIndex={currentIndex}
          onPrevious={() =>
            setCurrentIndex((prev) =>
              prev !== null && prev > 0 ? prev - 1 : prev
            )
          }
          onNext={() =>
            setCurrentIndex((prev) =>
              prev !== null && prev < photos.length - 1
                ? prev + 1
                : prev
            )
          }
          onClose={() => setCurrentIndex(null)}
        />
      )}

      {selectionMode && (
        <div
          className="
            fixed
            bottom-0
            left-0
            right-0
            z-50
            px-4
            pb-[env(safe-area-inset-bottom)]
            animate-in
            slide-in-from-bottom
          "
        >
          <div
            className="
              mx-auto
              flex
              max-w-lg
              items-center
              justify-between
              rounded-2xl
              border
              bg-background/95
              backdrop-blur
              px-5
              py-3
              shadow-xl
            "
          >
            <div>
              <p className="text-sm font-semibold">
                {selectedIds.length}枚選択中
              </p>

              <p className="text-xs text-muted-foreground">
                写真を保存します
              </p>
            </div>

            <button
              disabled={
                selectedIds.length === 0 ||
                isSaving
              }
              className="
                rounded-full
                bg-blue-600
                px-5
                py-2.5
                text-sm
                font-semibold
                text-white
                shadow-md
                transition
                active:scale-95
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
              onClick={async () => {
                if (isSaving) return;

                try {
                  setIsSaving(true);

                  const selectedPhotos = photos.filter((photo) =>
                    selectedIds.includes(photo.id)
                  );

                  await savePhotos(selectedPhotos);

                  // 保存成功
                  setSelectedIds([]);
                  setSelectionMode(false);

                } finally {
                  setIsSaving(false);
                }
              }}
            >
              {isSaving ? "保存中..." : "保存する"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
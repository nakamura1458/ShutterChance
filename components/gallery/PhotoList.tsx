"use client";

import { useState } from "react";
import PhotoCard from "./PhotoCard";
import FullscreenPhotoViewer from "./FullscreenPhotoViewer";
import type { PhotoListItem } from "@/types/photo";

type Props = {
  photos: PhotoListItem[];
};

export default function PhotoList({ photos }: Props) {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  return (
    <section
      id="photo-list"
      className="space-y-4"
    >
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xl font-bold">
          📸 Gallery
        </h2>

        <p className="text-sm text-muted-foreground">
          {photos.length} Photos
        </p>
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
              onClick={() => setCurrentIndex(index)}
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
    </section>
  );
}
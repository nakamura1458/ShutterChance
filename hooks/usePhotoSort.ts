import { useMemo, useState } from "react";

import type { PhotoListItem } from "@/types/photo";

export type PhotoSortOrder =
  | "newest"
  | "oldest"
  | "likes";

export function usePhotoSort(
  photos: PhotoListItem[]
) {
  const [sortOrder, setSortOrder] =
    useState<PhotoSortOrder>("newest");

  const sortedPhotos = useMemo(() => {
    const result = [...photos];

    switch (sortOrder) {
      case "oldest":
        return result.sort(
          (a, b) =>
            new Date(a.created_at).getTime() -
            new Date(b.created_at).getTime()
        );

      case "likes":
        return result.sort(
          (a, b) =>
            (b.like_count ?? 0) -
            (a.like_count ?? 0)
        );

      case "newest":
      default:
        return result.sort(
          (a, b) =>
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
        );
    }
  }, [photos, sortOrder]);

  const sortLabel = {
    newest: "新しい順",
    oldest: "古い順",
    likes: "いいね数順",
  }[sortOrder];

  return {
    sortOrder,
    sortedPhotos,
    sortLabel,
    setSortOrder,
  };
}
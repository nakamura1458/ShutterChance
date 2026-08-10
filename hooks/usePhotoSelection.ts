"use client";

import { useState } from "react";

import type { PhotoListItem } from "@/types/photo";
import { savePhotos } from "@/lib/utils/savePhotos";

export function usePhotoSelection(
  photos: PhotoListItem[]
) {
  // ========================================
  // Selection Mode
  // ========================================

  const [selectionMode, setSelectionMode] =
    useState(false);

  const [selectedIds, setSelectedIds] =
    useState<string[]>([]);

  const [isSaving, setIsSaving] =
    useState(false);

  // ========================================
  // Toggle Selection
  // ========================================

  const toggleSelection = (
    photoId: string
  ) => {
    setSelectedIds((prev) =>
      prev.includes(photoId)
        ? prev.filter(
            (id) => id !== photoId
          )
        : [...prev, photoId]
    );
  };

  // ========================================
  // Enter Selection Mode
  // ========================================

  const enterSelectionMode = () => {
    setSelectionMode(true);
  };

  // ========================================
  // Cancel Selection
  // ========================================

  const cancelSelection = () => {
    setSelectedIds([]);
    setSelectionMode(false);
  };

  // ========================================
  // Toggle Select All
  // ========================================

  const toggleSelectAll = (
    targetPhotos: PhotoListItem[] = photos
  ) => {
    if (selectedIds.length > 0) {
      // 1枚以上選択されていたら全解除
      setSelectedIds([]);
      return;
    }

    // 0枚なら全選択
    setSelectedIds(
      targetPhotos.map(
        (photo) => photo.id
      )
    );
  };

  // ========================================
  // Save Selected Photos
  // ========================================

  const saveSelectedPhotos =
    async () => {
      if (
        isSaving ||
        selectedIds.length === 0
      ) {
        return;
      }

      try {
        setIsSaving(true);

        const selectedPhotos =
          photos.filter((photo) =>
            selectedIds.includes(
              photo.id
            )
          );

        await savePhotos(
          selectedPhotos
        );

        // 保存成功
        setSelectedIds([]);
        setSelectionMode(false);
      } finally {
        setIsSaving(false);
      }
    };

  // ========================================
  // Return
  // ========================================

  return {
    selectionMode,
    selectedIds,
    isSaving,

    toggleSelection,
    enterSelectionMode,
    cancelSelection,
    toggleSelectAll,
    saveSelectedPhotos,
  };
}
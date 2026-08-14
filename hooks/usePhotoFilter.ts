"use client";

import { useMemo, useState } from "react";

import type { PhotoListItem } from "@/types/photo";

export function usePhotoFilter(
  photos: PhotoListItem[],
  guestPhotoCounts: Record<string, number>,
  totalPhotoCount: number
) {
  // ========================================
  // Applied Filter
  // ========================================

  // 実際に適用されているゲスト
  //
  // [] = 全員
  // ["りょう"] = りょうのみ
  // ["りょう", "田中"] = りょう OR 田中
  //
  const [
    selectedGuestNames,
    setSelectedGuestNames,
  ] = useState<string[]>([]);

  // ========================================
  // Pending Filter
  // ========================================

  // フィルターシートを開いている間の
  // 一時的な選択状態
  const [
    pendingGuestNames,
    setPendingGuestNames,
  ] = useState<string[]>([]);

  // ========================================
  // Filter Sheet
  // ========================================

  const [isFilterOpen, setIsFilterOpen] =
    useState(false);

  // ========================================
  // Guest Names
  // ========================================

  const guestNames = useMemo(() => {
    return Array.from(
      new Set(
        photos
          .map((photo) => photo.guest_name)
          .filter(
            (name): name is string =>
              Boolean(name)
          )
      )
    ).sort((a, b) =>
      a.localeCompare(b, "ja")
    );
  }, [photos]);

  // ========================================
  // Filtered Photos
  // ========================================

  const filteredPhotos = useMemo(() => {
    // フィルターなし
    if (selectedGuestNames.length === 0) {
      return photos;
    }

    // 複数選択の場合は OR
    //
    // 現時点ではページ内の写真から
    // フィルター対象を取得
    return photos.filter(
      (photo) =>
        photo.guest_name !== null &&
        selectedGuestNames.includes(
          photo.guest_name
        )
    );
  }, [
    photos,
    selectedGuestNames,
  ]);

  // ========================================
  // Pending Filter Result
  // ========================================

  const pendingFilteredPhotoCount =
    useMemo(() => {
      // 全員
      if (pendingGuestNames.length === 0) {
        return totalPhotoCount;
      }

      // 選択されたゲストの
      // DB全体の写真枚数を合計
      return pendingGuestNames.reduce(
        (total, guestName) =>
          total +
          (guestPhotoCounts[guestName] ?? 0),
        0
      );
    }, [
      pendingGuestNames,
      guestPhotoCounts,
      totalPhotoCount,
    ]);

  // ========================================
  // Filter Label
  // ========================================

  const filterLabel = useMemo(() => {
    // 全員
    if (selectedGuestNames.length === 0) {
      return "すべて";
    }

    // 1人
    if (selectedGuestNames.length === 1) {
      return selectedGuestNames[0];
    }

    // 複数人
    return `${selectedGuestNames.length}人選択中`;
  }, [selectedGuestNames]);

  // ========================================
  // Open Filter
  // ========================================
  const openFilter = (
    guestNamesFromUrl?: string[]
  ) => {
    setPendingGuestNames(
      guestNamesFromUrl ??
        selectedGuestNames
    );

    setIsFilterOpen(true);
  };

  // ========================================
  // Close Filter
  // ========================================

  const closeFilter = () => {
    setIsFilterOpen(false);
  };

  // ========================================
  // Toggle Guest
  // ========================================

  const toggleGuest = (
    guestName: string
  ) => {
    setPendingGuestNames((prev) => {
      // すでに選択されている場合
      // → 選択解除
      if (prev.includes(guestName)) {
        return prev.filter(
          (name) => name !== guestName
        );
      }

      // 未選択の場合
      // → 選択
      return [
        ...prev,
        guestName,
      ];
    });
  };

  // ========================================
  // Select All
  // ========================================

  const selectAllGuests = () => {
    // [] は「全員」を意味する
    setPendingGuestNames([]);
  };

  // ========================================
  // Apply Filter
  // ========================================

  const applyFilter = () => {
    console.log(
      "pendingGuestNames:",
      pendingGuestNames
    );

    setSelectedGuestNames([
      ...pendingGuestNames,
    ]);

    setIsFilterOpen(false);
  };

  // ========================================
  // Return
  // ========================================

  return {
    selectedGuestNames,
    pendingGuestNames,

    filteredPhotos,

    guestNames,

    // DB全体のゲスト別枚数
    guestPhotoCounts,

    filterLabel,

    isFilterOpen,

    pendingFilteredPhotoCount,

    openFilter,
    closeFilter,

    toggleGuest,
    selectAllGuests,
    applyFilter,
  };
}
"use client";

import { useCallback, useEffect, useState } from "react";

import { usePreviewUrls } from "./usePreviewUrls";
import { useSwipeNavigation } from "./useSwipeNavigation";

type Props = {
  photos: File[];
};

export function usePhotoPreview({
  photos,
}: Props) {
  const previewUrls = usePreviewUrls(photos);

  const [selectedIndex, setSelectedIndex] = useState(0);

  /*
   * 写真が削除されたとき、
   * selectedIndex が存在しない位置にならないように調整
   */
  useEffect(() => {
    if (previewUrls.length === 0) {
      setSelectedIndex(0);
      return;
    }

    setSelectedIndex((prev) =>
      Math.min(prev, previewUrls.length - 1)
    );
  }, [previewUrls.length]);

  /*
   * 前の写真
   */
  const showPrevious = useCallback(() => {
    if (previewUrls.length <= 1) {
      return;
    }

    setSelectedIndex((prev) =>
      prev === 0
        ? previewUrls.length - 1
        : prev - 1
    );
  }, [previewUrls.length]);

  /*
   * 次の写真
   */
  const showNext = useCallback(() => {
    if (previewUrls.length <= 1) {
      return;
    }

    setSelectedIndex((prev) =>
      prev === previewUrls.length - 1
        ? 0
        : prev + 1
    );
  }, [previewUrls.length]);

  /*
   * スワイプ
   */
  const swipeHandlers = useSwipeNavigation({
    length: previewUrls.length,
    index: selectedIndex,
    setIndex: setSelectedIndex,
  });

  return {
    previewUrls,

    selectedIndex,

    setSelectedIndex,

    showPrevious,

    showNext,

    swipeHandlers,
  };
}
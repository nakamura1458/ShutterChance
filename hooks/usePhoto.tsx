"use client";

import { useCallback, useState } from "react";

export function usePhoto() {
  const [photos, setPhotosState] = useState<File[]>([]);

  // 初回選択
  const setPhotos = useCallback(
    (files: File[]) => {
      setPhotosState(files);
    },
    []
  );

  // 追加選択
  const addPhotos = useCallback(
    (files: File[]) => {
      setPhotosState((prev) => [
        ...prev,
        ...files,
      ]);
    },
    []
  );

  // 1枚削除
  const removePhoto = useCallback(
    (index: number) => {
      setPhotosState((prev) =>
        prev.filter((_, i) => i !== index)
      );
    },
    []
  );

  // 全て削除
  const clearPhotos = useCallback(() => {
    setPhotosState([]);
  }, []);

  return {
    state: {
      photos,
    },

    actions: {
      setPhotos,
      addPhotos,
      removePhoto,
      clearPhotos,
    },
  };
}
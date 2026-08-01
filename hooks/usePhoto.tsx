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
      clearPhotos,
    },
  };
}
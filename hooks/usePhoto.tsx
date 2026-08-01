"use client";

import { useCallback, useState } from "react";
import type { CapturedPhoto } from "@/types/camera";

export function usePhoto() {
  const [capturedPhoto, setCapturedPhoto] =
    useState<CapturedPhoto | null>(null);

  const setPhoto = useCallback(
    (file: File) => {
      setCapturedPhoto((prev) => {
        if (prev) {
          URL.revokeObjectURL(prev.previewUrl);
        }

        return {
          blob: file,
          previewUrl: URL.createObjectURL(file),
        };
      });
    },
    []
  );

  const clearPhoto = useCallback(() => {
    setCapturedPhoto((prev) => {
      if (prev) {
        URL.revokeObjectURL(prev.previewUrl);
      }
      return null;
    });
  }, []);

  return {
    state: {
      capturedPhoto,
    },

    actions: {
      setPhoto,
      clearPhoto,
    },
  };
}
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CapturedPhoto } from "@/types/camera";

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [capturedPhoto, setCapturedPhoto] =
    useState<CapturedPhoto | null>(null);

  const [isCameraReady, setIsCameraReady] =
    useState(false);

  const stopCamera = useCallback(() => {
    streamRef.current
      ?.getTracks()
      .forEach((track) => track.stop());

    streamRef.current = null;

    setIsCameraReady(false);
  }, []);

  const startCamera = useCallback(async () => {
    try {
      stopCamera();

      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: {
              ideal: "environment",
            },
          },
          audio: false,
        });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setIsCameraReady(true);
    } catch (err) {
      console.error(err);

      alert(
        "カメラを起動できませんでした。"
      );
    }
  }, [stopCamera]);

  useEffect(() => {
    startCamera();

    return () => {
      stopCamera();

      if (capturedPhoto) {
        URL.revokeObjectURL(
          capturedPhoto.previewUrl
        );
      }
    };
  }, [startCamera, stopCamera]);

  const takePhoto = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    ctx.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    );

    canvas.toBlob(
      (blob) => {
        if (!blob) return;

        if (capturedPhoto) {
          URL.revokeObjectURL(
            capturedPhoto.previewUrl
          );
        }

        setCapturedPhoto({
          blob,
          previewUrl:
            URL.createObjectURL(blob),
        });
      },
      "image/jpeg",
      0.8
    );
  }, [capturedPhoto]);

  const retakePhoto = useCallback(async () => {
    if (capturedPhoto) {
      URL.revokeObjectURL(
        capturedPhoto.previewUrl
      );
    }

    setCapturedPhoto(null);

    await startCamera();
  }, [capturedPhoto, startCamera]);

  return {
    state: {
      capturedPhoto,
      isCameraReady,
    },

    refs: {
      videoRef,
      canvasRef,
    },

    actions: {
      startCamera,
      stopCamera,
      takePhoto,
      retakePhoto,
    },
  };
}
"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import type { CapturedPhoto } from "@/types/camera";

type Props = {
  enabled: boolean;
};

export function useCamera({
  enabled,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<CapturedPhoto | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  const [facingMode, setFacingMode] = useState< "user" | "environment" >("environment");

  const stopCamera = useCallback(() => {
    streamRef.current
      ?.getTracks()
      .forEach((track) => {
        track.stop();
      });
    streamRef.current = null;
    setIsCameraReady(false);
  }, []);

  const startCamera = useCallback(
    async () => {
      try {
        stopCamera();
        const stream =
          await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: {
                ideal: facingMode,
              },
            },
            audio: false,
          });

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;

          await new Promise<void>((resolve) => {
            videoRef.current!.onloadedmetadata = () => {
              resolve();
            };
          });

          await videoRef.current.play();

        }

        setIsCameraReady(true);

      } catch(err){
        if(err instanceof Error){
          alert(
            `${err.name}: ${err.message}`
          );
        }else{
          alert(
            "カメラを起動できませんでした"
          );
        }
      }
    },
    [
      stopCamera,
      facingMode,
    ]
  );

  const switchCamera =
    useCallback(async () => {

      const nextMode =
        facingMode === "environment"
          ? "user"
          : "environment";

      stopCamera();

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: facingMode,
          },
          audio: false,
        });

        streamRef.current = stream;

        if(videoRef.current){
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          console.log({
            videoWidth: videoRef.current.videoWidth,
            videoHeight: videoRef.current.videoHeight,
          });
        }

        setFacingMode(nextMode);

        setIsCameraReady(true);

      } catch(err){
        console.error(
          "switchCamera error:",
          err
        );
      }

    },[
      facingMode,
      stopCamera,
    ]);

  useEffect(() => {

    if(!enabled){
      return;
    }

    startCamera();

    return()=>{
      stopCamera();
      if(capturedPhoto){
        URL.revokeObjectURL(
          capturedPhoto.previewUrl
        );
      }
    };

  },[
    enabled,
    startCamera,
    stopCamera,
  ]);

  const takePhoto =
    useCallback(() => {

      const video = videoRef.current;

      const canvas =canvasRef.current;

      if(!video || !canvas){
        return;
      }

      canvas.width = video.videoWidth;

      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");

      if(!ctx){
        return;
      }

      ctx.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
      );

      canvas.toBlob(
        (blob)=>{
          if(!blob){
            return;
          }
          if(capturedPhoto){
            URL.revokeObjectURL(
              capturedPhoto.previewUrl
            );
          }
          setCapturedPhoto({
            blob,
            previewUrl: URL.createObjectURL(blob),
          });
        },
        "image/jpeg",
        0.8
      );

    },[
      capturedPhoto,
    ]);

  const retakePhoto =
    useCallback(async()=>{
      if(capturedPhoto){
        URL.revokeObjectURL(
          capturedPhoto.previewUrl
        );
      }
      setCapturedPhoto(null);
      await startCamera();
    },[
      capturedPhoto,
      startCamera,
    ]);

  return {
    state:{
      capturedPhoto,
      isCameraReady,
      facingMode,
    },

    refs:{
      videoRef,
      canvasRef,
    },

    actions:{
      startCamera,
      stopCamera,
      takePhoto,
      retakePhoto,
      switchCamera,
    },

  };

}
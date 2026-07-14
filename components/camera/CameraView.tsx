"use client";

import { RefObject } from "react";

type Props = {
  videoRef: RefObject<HTMLVideoElement | null>;
};

export default function CameraView({
  videoRef,
}: Props) {
  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      className="w-full"
    />
  );
}
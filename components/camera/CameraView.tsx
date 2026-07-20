"use client";

import { RefObject } from "react";

type Props = {
  videoRef: RefObject<HTMLVideoElement | null>;
};

export default function CameraView({ videoRef }: Props) {
  return (
    <div className="absolute inset-0">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="block h-full w-full object-cover"
      />
    </div>
  );
}
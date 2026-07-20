"use client";

import { RefObject } from "react";

type Props = {
  videoRef: RefObject<HTMLVideoElement | null>;
};

export default function CameraView({ videoRef }: Props) {
  return (
    <div className="fixed inset-0 overflow-hidden bg-black">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 h-full w-full object-contain"
      />
    </div>
  );
}
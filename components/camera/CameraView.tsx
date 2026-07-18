"use client";

import { RefObject, useEffect } from "react";

type Props = {
  videoRef: RefObject<HTMLVideoElement | null>;
};

export default function CameraView({
  videoRef,
}: Props) {

  return (
    <div className="
      relative
      w-full
      aspect-[4/5]
      overflow-hidden
      rounded-2xl
      bg-black
    ">

      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="
          w-full
          h-full
          object-cover
        "
      />

    </div>
  );

}
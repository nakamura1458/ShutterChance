"use client";

import { SwitchCamera } from "lucide-react";

type Props = {
  onClick: () => void;
};

export default function CameraSwitchButton({
  onClick,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        absolute
        right-4
        top-4
        z-20
        flex
        h-12
        w-12
        items-center
        justify-center
        rounded-full
        bg-black/40
        text-white
        backdrop-blur
        transition
        active:scale-90
      "
      aria-label="カメラ切替"
    >
      <SwitchCamera
        size={24}
        strokeWidth={2}
      />
    </button>
  );
}
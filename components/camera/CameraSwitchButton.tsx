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
        flex
        h-12
        w-12
        items-center
        justify-center
        rounded-full
        bg-black/30
        text-white
        backdrop-blur-md
        active:scale-95
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
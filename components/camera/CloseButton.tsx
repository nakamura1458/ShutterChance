"use client";

import { X } from "lucide-react";

type Props = {
  onClick: () => void;
};

export default function CloseButton({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="
        fixed
        top-6
        left-6
        z-[60]
        flex
        h-12
        w-12
        items-center
        justify-center
        rounded-full
        bg-black/50
        text-white
        backdrop-blur
        active:scale-95
      "
      aria-label="閉じる"
    >
      <X size={28} />
    </button>
  );
}
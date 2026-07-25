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
        flex h-11 w-11 items-center justify-center
        rounded-full
        bg-black/40
        backdrop-blur-xl
        border border-white/10
        text-white
        transition-transform
        active:scale-95
      "
    >
      <X className="h-6 w-6" />
    </button>
  );
}
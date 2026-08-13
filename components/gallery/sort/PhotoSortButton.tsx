"use client";

import { ArrowDownUp } from "lucide-react";

type Props = {
  label: string;
  active: boolean;
  onClick: () => void;
};

export default function PhotoSortButton({
  label,
  active,
  onClick,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex
        items-center
        gap-1.5
        rounded-full
        border
        px-3
        py-1.5
        text-sm
        font-medium
        transition
        active:scale-95
        ${
          active
            ? "border-blue-200 bg-blue-50 text-blue-600"
            : "border-zinc-200 bg-white text-zinc-700"
        }
      `}
    >
      <ArrowDownUp size={15} />
      {label}
    </button>
  );
}
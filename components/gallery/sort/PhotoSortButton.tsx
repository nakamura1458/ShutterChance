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
      aria-label={label}
      className={`
        inline-flex
        items-center
        justify-center
        rounded-full
        border
        p-2
        sm:gap-1.5
        sm:px-3
        sm:py-1.5
        text-xs
        font-medium
        shadow-sm
        transition
        active:scale-95
        ${
          active
            ? `
              border-blue-200
              bg-blue-50
              text-blue-600
              dark:border-blue-900
              dark:bg-blue-950/30
              dark:text-blue-400
            `
            : `
              border-zinc-200
              bg-white
              text-zinc-700
              dark:border-zinc-800
              dark:bg-background
              dark:text-zinc-300
            `
        }
      `}
    >
      <ArrowDownUp size={16} />

      <span className="hidden sm:inline">
        {label}
      </span>
    </button>
  );
}
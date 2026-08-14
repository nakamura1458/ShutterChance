"use client";

import {
  ChevronDown,
  Filter,
} from "lucide-react";

type Props = {
  label: string;
  active?: boolean;
  onClick: () => void;
};

export default function PhotoFilterButton({
  label,
  active = false,
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
              text-blue-700
              dark:border-blue-900
              dark:bg-blue-950/30
              dark:text-blue-400
            `
            : `
              bg-background
              hover:bg-muted/50
            `
        }
      `}
    >
      <Filter
        size={16}
        className={
          active
            ? "text-blue-600"
            : "text-muted-foreground"
        }
      />

      <span className="hidden sm:inline">
        {label}
      </span>

      <ChevronDown
        size={12}
        className="
          hidden
          sm:inline
          text-muted-foreground
        "
      />
    </button>
  );
}
"use client";

import { Check } from "lucide-react";

import type { PhotoSortOrder } from "@/hooks/usePhotoSort";

type Props = {
  open: boolean;
  currentSort: PhotoSortOrder;
  onClose: () => void;
  onChange: (sort: PhotoSortOrder) => void;
};

const options: {
  value: PhotoSortOrder;
  label: string;
}[] = [
  {
    value: "newest",
    label: "新しい順",
  },
  {
    value: "oldest",
    label: "古い順",
  },
  {
    value: "likes",
    label: "いいね数順",
  },
];

export default function PhotoSortSheet({
  open,
  currentSort,
  onClose,
  onChange,
}: Props) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-end
        justify-center
        bg-black/40
      "
      onClick={onClose}
    >
      <div
        className="
          w-full
          max-w-lg
          rounded-t-2xl
          bg-white
          p-5
          pb-8
          shadow-xl
        "
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-bold">
            並び替え
          </h3>

          <button
            type="button"
            onClick={onClose}
            className="
              text-sm
              font-medium
              text-muted-foreground
              active:opacity-60
            "
          >
            閉じる
          </button>
        </div>

        <div className="space-y-1">
          {options.map((option) => {
            const selected =
              currentSort === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  onClose();
                }}
                className="
                  flex
                  w-full
                  items-center
                  justify-between
                  rounded-xl
                  px-4
                  py-3.5
                  text-left
                  transition
                  hover:bg-zinc-50
                  active:bg-zinc-100
                "
              >
                <span
                  className={`
                    text-sm
                    ${
                      selected
                        ? "font-semibold text-blue-600"
                        : "text-zinc-900"
                    }
                  `}
                >
                  {option.label}
                </span>

                {selected && (
                  <Check
                    className="h-5 w-5 text-blue-600"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
"use client";

import {
  Check,
  Filter,
  X,
} from "lucide-react";

type Props = {
  open: boolean;
  guestNames: string[];
  guestPhotoCounts: Record<string, number>;
  pendingGuestNames: string[];
  pendingPhotoCount: number;
  totalPhotoCount: number;

  onClose: () => void;
  onToggleGuest: (guestName: string) => void;
  onSelectAll: () => void;
  onApply: () => void;
};

export default function PhotoFilterSheet({
  open,
  guestNames,
  guestPhotoCounts,
  pendingGuestNames,
  pendingPhotoCount,
  totalPhotoCount,
  onClose,
  onToggleGuest,
  onSelectAll,
  onApply,
}: Props) {
  if (!open) {
    return null;
  }

  const isAllSelected =
    pendingGuestNames.length === 0;

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
      "
    >
      {/* ======================================
          Backdrop
      ====================================== */}

      <button
        type="button"
        aria-label="フィルターを閉じる"
        onClick={onClose}
        className="
          absolute
          inset-0
          bg-black/30
          backdrop-blur-[2px]
          animate-in
          fade-in
        "
      />

      {/* ======================================
          Bottom Sheet
      ====================================== */}

      <div
        className="
          absolute
          bottom-0
          left-0
          right-0
          mx-auto
          max-w-lg
          overflow-hidden
          rounded-t-[28px]
          bg-background
          shadow-2xl
          animate-in
          slide-in-from-bottom
          duration-200
        "
      >
        {/* ====================================
            Handle
        ===================================== */}

        <div
          className="
            flex
            justify-center
            pt-3
          "
        >
          <div
            className="
              h-1
              w-10
              rounded-full
              bg-muted-foreground/20
            "
          />
        </div>

        {/* ====================================
            Header
        ===================================== */}

        <div
          className="
            flex
            items-center
            justify-between
            px-5
            pb-3
            pt-4
          "
        >
          <div>
            <h3
              className="
                text-lg
                font-bold
                tracking-tight
              "
            >
              写真を表示
            </h3>

            <p
              className="
                mt-0.5
                text-xs
                text-muted-foreground
              "
            >
              複数の人を選択できます
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              rounded-full
              bg-muted
              p-2
              text-muted-foreground
              transition
              active:scale-90
            "
          >
            <X size={18} />
          </button>
        </div>

        {/* ====================================
            Guest List
        ===================================== */}

        <div
          className="
            max-h-[50vh]
            overflow-y-auto
            px-3
            pb-3
          "
        >
          {/* ==================================
              All
          =================================== */}

          <button
            type="button"
            onClick={onSelectAll}
            className={`
              flex
              w-full
              items-center
              justify-between
              rounded-2xl
              px-3
              py-3
              transition
              active:scale-[0.98]
              ${
                isAllSelected
                  ? `
                    bg-blue-50
                    dark:bg-blue-950/30
                  `
                  : `
                    hover:bg-muted/50
                  `
              }
            `}
          >
            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              {/* Icon */}

              <div
                className={`
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  ${
                    isAllSelected
                      ? `
                        bg-blue-600
                        text-white
                      `
                      : `
                        bg-muted
                      `
                  }
                `}
              >
                {isAllSelected ? (
                  <Check size={18} />
                ) : (
                  <Filter
                    size={17}
                    className="
                      text-muted-foreground
                    "
                  />
                )}
              </div>

              {/* Text */}

              <div
                className="
                  text-left
                "
              >
                <p
                  className={`
                    text-sm
                    ${
                      isAllSelected
                        ? "font-semibold"
                        : "font-medium"
                    }
                  `}
                >
                  すべて
                </p>

                <p
                  className="
                    text-xs
                    text-muted-foreground
                  "
                >
                  全員の写真
                </p>
              </div>
            </div>

            {/* Count */}

            <span
              className="
                pr-2
                text-xs
                font-medium
                text-muted-foreground
              "
            >
              {totalPhotoCount}枚
            </span>
          </button>

          {/* ==================================
              Guests
          =================================== */}

          {guestNames.map((name) => {
            const isSelected =
              pendingGuestNames.includes(name);

            const count =
              guestPhotoCounts[name] ?? 0;

            return (
              <button
                key={name}
                type="button"
                onClick={() =>
                  onToggleGuest(name)
                }
                className={`
                  flex
                  w-full
                  items-center
                  justify-between
                  rounded-2xl
                  px-3
                  py-3
                  transition
                  active:scale-[0.98]
                  ${
                    isSelected
                      ? `
                        bg-blue-50
                        dark:bg-blue-950/30
                      `
                      : `
                        hover:bg-muted/50
                      `
                  }
                `}
              >
                <div
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >
                  {/* Avatar */}

                  <div
                    className={`
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-full
                      text-sm
                      font-semibold
                      transition
                      ${
                        isSelected
                          ? `
                            bg-blue-600
                            text-white
                          `
                          : `
                            bg-muted
                            text-muted-foreground
                          `
                      }
                    `}
                  >
                    {isSelected ? (
                      <Check size={18} />
                    ) : (
                      name.charAt(0)
                    )}
                  </div>

                  {/* Name */}

                  <p
                    className={`
                      text-sm
                      ${
                        isSelected
                          ? "font-semibold"
                          : "font-medium"
                      }
                    `}
                  >
                    {name}
                  </p>
                </div>

                {/* Count */}

                <span
                  className="
                    pr-2
                    text-xs
                    font-medium
                    text-muted-foreground
                  "
                >
                  {count}枚
                </span>
              </button>
            );
          })}
        </div>

        {/* ====================================
            Apply Button
        ===================================== */}

        <div
          className="
            border-t
            bg-background/95
            px-4
            pt-3
            backdrop-blur
          "
        >
          <button
            type="button"
            onClick={onApply}
            className="
              w-full
              rounded-2xl
              bg-blue-600
              px-4
              py-3.5
              text-sm
              font-semibold
              text-white
              shadow-sm
              transition
              active:scale-[0.98]
            "
          >
            {isAllSelected
              ? "すべて"
              : `${pendingGuestNames.length}人の写真を表示（${pendingPhotoCount}枚）`}
          </button>

          {/* iPhone Safe Area */}

          <div
            className="
              h-[env(safe-area-inset-bottom)]
            "
          />
        </div>
      </div>
    </div>
  );
}
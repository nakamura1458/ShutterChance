"use client";

type Props = {
  selectedCount: number;
  isSaving: boolean;
  onSave: () => void;
};

export default function PhotoSelectionBar({
  selectedCount,
  isSaving,
  onSave,
}: Props) {
  return (
    <div
      className="
        fixed
        bottom-0
        left-0
        right-0
        z-50
        px-4
        pb-[env(safe-area-inset-bottom)]
        animate-in
        slide-in-from-bottom
      "
    >
      <div
        className="
          mx-auto
          flex
          max-w-lg
          items-center
          justify-between
          rounded-2xl
          border
          bg-background/95
          px-5
          py-3
          shadow-xl
          backdrop-blur
        "
      >
        {/* ====================================
            Selection Info
        ===================================== */}

        <div>
          <p
            className="
              text-sm
              font-semibold
            "
          >
            {selectedCount}枚選択中
          </p>

          <p
            className="
              text-xs
              text-muted-foreground
            "
          >
            写真を保存します
          </p>
        </div>

        {/* ====================================
            Save Button
        ===================================== */}

        <button
          type="button"
          disabled={
            selectedCount === 0 ||
            isSaving
          }
          className="
            rounded-full
            bg-blue-600
            px-5
            py-2.5
            text-sm
            font-semibold
            text-white
            shadow-md
            transition
            active:scale-95
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
          onClick={onSave}
        >
          {isSaving
            ? "保存中..."
            : "保存する"}
        </button>
      </div>
    </div>
  );
}
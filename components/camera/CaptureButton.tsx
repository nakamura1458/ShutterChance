"use client";

type Props = {
  onClick: () => void;
};

export default function CaptureButton({
  onClick,
}: Props) {
  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={onClick}
        aria-label="写真を撮影"
        className="
          flex
          items-center
          justify-center
          w-14
          h-14
          rounded-full
          bg-white
          border-[6px]
          border-gray-300
          shadow-xl
          transition
          active:scale-90
        "
      >
        <div
          className="
            w-9
            h-9
            rounded-full
            bg-white
            border
            border-gray-200
          "
        />
      </button>

      <span className="text-sm text-white">
        撮影する
      </span>
    </div>
  );
}
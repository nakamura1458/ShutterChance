"use client";

type Props = {
  urls: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  onRemove: (index: number) => void;
};

export default function PreviewThumbnail({
  urls,
  selectedIndex,
  onSelect,
  onRemove,
}: Props) {
  return (
    <div
      className="
        shrink-0
        overflow-x-auto
        px-4
        pb-3
        overscroll-contain
      "
    >
      <div
        className="
          flex
          gap-2
        "
      >
        {urls.map((url, index) => (
          <div
            key={url}
            className="
              relative
              h-16
              w-16
              shrink-0
            "
          >
            {/* サムネイル */}
            <button
              type="button"
              onClick={() => onSelect(index)}
              className={`
                relative
                h-full
                w-full
                overflow-hidden
                rounded-xl
                transition

                ${
                  selectedIndex === index
                    ? "ring-2 ring-primary"
                    : "opacity-60"
                }
              `}
            >
              <img
                src={url}
                alt={`写真 ${index + 1}`}
                className="
                  h-full
                  w-full
                  select-none
                  object-cover
                "
              />
            </button>

            {/* 削除ボタン */}
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onRemove(index);
              }}
              aria-label={`写真 ${index + 1} を削除`}
              className="
                absolute
                right-1
                top-1
								z-10
                flex
                h-5
                w-5
                items-center
                justify-center
                rounded-full
                bg-black/80
                text-xs
                text-white
                shadow
                backdrop-blur
                transition
                hover:bg-black
                active:scale-90
              "
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
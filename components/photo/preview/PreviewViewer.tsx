"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  url?: string;

  swipeHandlers: {
    onTouchStart?: any;
    onTouchMove?: any;
    onTouchEnd?: any;
    onMouseDown?: any;
    onMouseMove?: any;
    onMouseUp?: any;
  };

  onPrevious: () => void;
  onNext: () => void;

  onRemove: () => void;

  hasMultiplePhotos: boolean;
};

export default function PreviewViewer({
  url,
  swipeHandlers,
  onPrevious,
  onNext,
  onRemove,
  hasMultiplePhotos,
}: Props) {
  return (
    <main
      {...swipeHandlers}
      className="
        relative
        h-full
        w-full
        overflow-hidden
        touch-pan-y
      "
    >
      <AnimatePresence mode="wait">
        {url && (
           <motion.div
            key={url}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="
              absolute
              inset-0
              flex
              items-center
              justify-center
              p-4
            "
          >
            <div
              className="
                relative
                flex
                h-auto
                max-h-full
                max-w-full
              "
            >
              <img
                src={url}
                draggable={false}
                className="
                  block
                  max-h-[calc(100%-16px)]
                  max-w-full
                  rounded-2xl
                  object-contain
                  select-none
                "
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Previous */}
      {hasMultiplePhotos && (
        <button
          type="button"
          onClick={onPrevious}
          className="
            absolute
            left-3
            top-1/2
            hidden
            -translate-y-1/2
            rounded-full
            bg-black/40
            p-2
            text-white
            backdrop-blur-md
            active:scale-90
            sm:flex
          "
        >
          <ChevronLeft className="h-7 w-7" />
        </button>
      )}

      {/* Next */}
      {hasMultiplePhotos && (
        <button
          type="button"
          onClick={onNext}
          className="
            absolute
            right-3
            top-1/2
            hidden
            -translate-y-1/2
            rounded-full
            bg-black/40
            p-2
            text-white
            backdrop-blur-md
            active:scale-90
            sm:flex
          "
        >
          <ChevronRight className="h-7 w-7" />
        </button>
      )}
    </main>
  );
}
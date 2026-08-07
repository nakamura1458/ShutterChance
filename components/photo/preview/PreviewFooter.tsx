"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

type Props = {
  uploading: boolean;
  actions: {
    onClear: () => void;
    onAddPhoto: () => void;
    onUpload: () => void;
  };
};


export default function PreviewFooter({
  uploading,
  actions,
}: Props) {

  return (

    <footer
      className="
        shrink-0
        space-y-3
        border-t
        border-white/10
        bg-black/90
        px-4
        pt-3
        pb-3
        backdrop-blur-xl
      "
    >

      <Button
        type="button"
        variant="ghost"
        disabled={uploading}
        onClick={actions.onAddPhoto}
        className="
          h-12
          w-full
          rounded-xl
          text-white
          hover:bg-white/10
        "
      >
        ＋ 写真を追加
      </Button>

      <motion.button
        type="button"
        disabled={uploading}
        onClick={actions.onUpload}
        whileTap={{
          scale: 0.96,
        }}
        className="
          flex
          h-14
          w-full
          items-center
          justify-center
          rounded-2xl
          bg-primary
          font-semibold
          text-primary-foreground
          shadow-lg
          disabled:opacity-60
        "
      >
        { uploading ? (
            <>
              <Loader2
                className="
                  mr-2
                  h-5
                  w-5
                  animate-spin
                "
              />
              写真を届けています...
            </>
          ):(
            <>
              ✨ 写真を共有する
            </>
          )
        }

      </motion.button>

      <button
        type="button"
        disabled={uploading}
        onClick={actions.onClear}
        className="
          w-full
          text-center
          text-sm
          text-white/50
        "
      >
        選択を解除
      </button>

    </footer>

  );

}
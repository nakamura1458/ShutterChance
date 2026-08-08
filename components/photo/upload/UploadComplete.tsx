"use client";

import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import {
  CheckCircle2,
  Images,
  Upload,
} from "lucide-react";
import Link from "next/link";

type Props = {
  photos: File[];
  eventToken: string;
  onRetryUpload: () => void;
};

export default function UploadComplete({
  photos,
  eventToken,
  onRetryUpload
}: Props) {

  // 🎉 完了演出
  useEffect(() => {
    const timer = setTimeout(() => {
      confetti({
        particleCount: 90,
        spread: 100,
        startVelocity: 28,
        gravity: 0.8,
        scalar: 0.8,
        origin: {
          y: 0.5,
        },
      });
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const previewUrls = useMemo(() => {
    return photos.map((photo) => URL.createObjectURL(photo));
  }, [photos]);

  useEffect(() => {
    return () => {
      previewUrls.forEach(URL.revokeObjectURL);
    };
  }, [previewUrls]);


  return (
    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-gradient-to-b
        from-[#fffaf5]
        to-white
        px-6
      "
    >

      <motion.div
        initial={{
          opacity: 0,
          y: 30,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
        className="
          w-full
          max-w-sm
          rounded-3xl
          bg-white/10
          p-8
          text-center
          shadow-2xl
          backdrop-blur-xl
          border
          border-white/10
        "
      >

        {/* 完了アイコン */}
        <motion.div
          initial={{
            scale: 0,
            rotate: -30,
          }}
          animate={{
            scale: 1,
            rotate: 0,
          }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 14,
            delay: 0.2,
          }}
          className="
            mx-auto
            flex
            h-24
            w-24
            items-center
            justify-center
            rounded-full
            bg-white/10
            backdrop-blur
          "
        >
          <CheckCircle2
            size={60}
            className="text-white"
            strokeWidth={2}
          />
        </motion.div>


        {/* メッセージ */}
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 0.6,
          }}
        >

          <h2
            className="
              mt-6
              text-2xl
              font-semibold
              tracking-wide
              text-gray-800
            "
          >
            写真を届けました
          </h2>


          <p
            className="
              mt-3
              text-sm
              leading-relaxed
              text-gray-500
            "
          >
            素敵な写真をありがとうございます。
            <br />
            新郎新婦の思い出に追加されました📸
          </p>

        </motion.div>


        {/* 写真共有カード */}
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.9,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            delay: 0.9,
          }}
          className="
            mt-7
            rounded-3xl
            bg-white/5
            px-5
            py-6
            backdrop-blur
            border
            border-white/10
          "
        >

          <div className="relative mx-auto h-40 w-56">

            {previewUrls.slice(0, 3).map((src, index) => (
              <motion.img
                key={src}
                src={src}
                alt={`preview-${index}`}
                initial={{
                  opacity: 0,
                  y: 20,
                  rotate: 0,
                  scale: 0.9,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  rotate: (index - 1) * 8,
                  scale: 1,
                }}
                whileHover={{
                  scale: 1.03,
                }}
                transition={{
                  delay: 0.9 + index * 0.15,
                  type: "spring",
                  stiffness: 180,
                }}
                className="
                  absolute
                  h-40
                  w-32
                  rounded-2xl
                  object-cover
                  border
                  border-white/30
                  shadow-2xl
                "
                style={{
                  left: "50%",
                  transform: `translateX(-50%) translateX(${(index - 1) * 32}px) rotate(${(index - 1) * 8}deg)`,
                  zIndex: index,
                }}
              />
            ))}

          </div>

          <p
            className="
              mt-4
              text-sm
              text-white/70
            "
          >
            <span className="font-semibold text-white">
              {photos.length}枚
            </span>
            の写真を
            <br />
            ギャラリーへ追加しました
          </p>

        </motion.div>


        {/* ボタン */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 1.1,
          }}
          className="
            mt-8
            flex
            flex-col
            gap-3
          "
        >

          <motion.div
            whileTap={{
              scale: 0.96,
            }}
          >
            <Link
              href={`/e/${eventToken}/photos`}
              className="
                flex
                h-14
                items-center
                justify-center
                gap-2
                rounded-2xl
                bg-white
                text-sm
                font-semibold
                text-black
                shadow-lg
                transition
              "
            >
              <Images size={20} />
              ギャラリーを見る
            </Link>
          </motion.div>


          <button
            onClick={onRetryUpload}
            className="
              flex
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-gray-300
              bg-white
              text-gray-800
              py-3
              text-sm
              font-semibold
              shadow-md
              transition
              hover:bg-gray-50
              active:scale-[0.98]
            "
          >
            <Upload size={18} />
            もう一度写真を送る
          </button>

        </motion.div>

      </motion.div>

    </div>
  );
}

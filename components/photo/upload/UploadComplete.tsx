"use client";

import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import {
  CheckCircle2,
  Images,
  Upload,
  Home,
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
  onRetryUpload,
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
    <div className="fixed inset-0 z-50 min-h-[100dvh] bg-white">
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
          flex
          min-h-[100dvh]
          w-full
          flex-col
          overflow-y-auto
          px-6
          pb-[calc(env(safe-area-inset-bottom)+24px)]
          pt-10
        "
      >
        {/* メインコンテンツ */}
        <div className="flex flex-1 flex-col items-center justify-center">
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
              flex
              h-24
              w-24
              items-center
              justify-center
              rounded-full
              bg-green-50
              ring-8
              ring-green-50/60
            "
          >
            <CheckCircle2
              size={60}
              className="text-green-500"
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
            className="text-center"
          >
            <h2
              className="
                mt-6
                text-2xl
                font-semibold
                tracking-wide
                text-gray-900
              "
            >
              🎊アップロード完了
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
              写真が思い出に追加されました📸
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
              w-full
              max-w-sm
              rounded-3xl
              border
              border-gray-100
              bg-gray-50
              px-5
              py-6
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
                    left-1/2
                    h-40
                    w-32
                    -translate-x-1/2
                    rounded-2xl
                    border
                    border-white
                    object-cover
                    shadow-xl
                  "
                  style={{
                    transform: `translateX(calc(-50% + ${
                      (index - 1) * 28
                    }px)) rotate(${(index - 1) * 8}deg)`,
                    zIndex: index,
                  }}
                />
              ))}
            </div>

            <p
              className="
                mt-4
                text-center
                text-sm
                text-gray-500
              "
            >
              <span className="font-semibold text-gray-900">
                {photos.length}枚
              </span>
              の写真を
              <br />
              ギャラリーへ追加しました
            </p>
          </motion.div>
        </div>

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
            mx-auto
            w-full
            max-w-sm
            space-y-3
          "
        >
          {/* ギャラリー */}
          <motion.div whileTap={{ scale: 0.96 }}>
            <Link
              href={`/e/${eventToken}/photos`}
              className="
                flex
                h-14
                items-center
                justify-center
                gap-2.5
                rounded-2xl
                bg-black
                text-sm
                font-semibold
                text-white
                shadow-md
                transition
                hover:bg-gray-800
                active:scale-[0.98]
              "
            >
              <Images
                size={20}
                strokeWidth={2}
              />
              ギャラリーを見る
            </Link>
          </motion.div>

          {/* もう一度送る */}
          <motion.button
            whileTap={{
              scale: 0.96,
            }}
            onClick={onRetryUpload}
            className="
              flex
              h-12
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-gray-200
              bg-white
              text-sm
              font-semibold
              text-gray-700
              shadow-sm
              transition
              hover:bg-gray-50
            "
          >
            <Upload size={18} />
            もう一度写真を送る
          </motion.button>

          {/* トップへ戻る */}
          <motion.div whileTap={{ scale: 0.96 }}>
            <button
              type="button"
              onClick={() => {
                window.location.href = `/e/${eventToken}`;
              }}
              className="
                flex
                h-12
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                text-sm
                font-medium
                text-gray-500
                transition
                hover:bg-gray-50
                hover:text-gray-700
                active:scale-[0.98]
              "
            >
              <Home
                size={18}
                strokeWidth={2}
              />
              トップに戻る
            </button>
          </motion.div>
          
        </motion.div>
      </motion.div>
    </div>
  );
}
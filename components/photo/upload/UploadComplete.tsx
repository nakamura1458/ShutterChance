"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import {
  CheckCircle2,
  Images,
  Upload,
  Home,
  Share2,
} from "lucide-react";
import Link from "next/link";

type Props = {
  uploadedPhotos: File[];
  eventToken: string;
  onRetryUpload: () => void;
};

export default function UploadComplete({
  uploadedPhotos,
  eventToken,
  onRetryUpload,
}: Props) {
  const [selectedIndexes, setSelectedIndexes] =
    useState<number[]>([]);

  // ----------------------------------------
  // 完了演出
  // ----------------------------------------

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

  // ----------------------------------------
  // プレビューURL生成
  // ----------------------------------------

  const previewUrls = useMemo(() => {
    return uploadedPhotos.map((photo) =>
      URL.createObjectURL(photo),
    );
  }, [uploadedPhotos]);

  // ----------------------------------------
  // プレビューURL解放
  // ----------------------------------------

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [previewUrls]);

  // ----------------------------------------
  // 写真の選択 / 選択解除
  // ----------------------------------------

  const togglePhoto = (index: number) => {
    setSelectedIndexes((prev) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index);
      }

      return [...prev, index];
    });
  };

  // ----------------------------------------
  // 写真を共有
  // ----------------------------------------

  const handleShare = async () => {
    const selectedPhotos = selectedIndexes
      .map((index) => uploadedPhotos[index])
      .filter(
        (photo): photo is File =>
          Boolean(photo),
      );

    if (selectedPhotos.length === 0) {
      return;
    }

    if (!navigator.share) {
      alert(
        "この端末では写真の共有に対応していません。",
      );
      return;
    }

    try {
      const canShareFiles =
        navigator.canShare?.({
          files: selectedPhotos,
        }) ?? false;

      if (!canShareFiles) {
        alert(
          "この端末では写真の共有に対応していません。",
        );
        return;
      }

      await navigator.share({
        files: selectedPhotos,
        title: "ShutterChance",
      });
    } catch (error) {
      if (
        error instanceof DOMException &&
        error.name === "AbortError"
      ) {
        return;
      }

      console.error(
        "写真の共有に失敗しました:",
        error,
      );

      alert("写真の共有に失敗しました。");
    }
  };

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        h-[100dvh]
        w-full
        overflow-hidden
        bg-white
      "
    >
      {/* ---------------------------------------- */}
      {/* スクロール領域 */}
      {/* ---------------------------------------- */}

      <div
        className="
          h-full
          w-full
          overflow-y-auto
          overscroll-contain
          px-5
          pt-8
          pb-[calc(env(safe-area-inset-bottom)+24px)]
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
            flex
            min-h-full
            w-full
            flex-col
            items-center
          "
        >
          {/* ---------------------------------------- */}
          {/* 完了アイコン */}
          {/* ---------------------------------------- */}

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
              shrink-0
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

          {/* ---------------------------------------- */}
          {/* メッセージ */}
          {/* ---------------------------------------- */}

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

          {/* ---------------------------------------- */}
          {/* 写真カード */}
          {/* ---------------------------------------- */}

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
              rounded-3xl
              border
              border-gray-100
              bg-gray-50
              px-5
              py-6
            "
          >
            <div className="relative mx-auto h-40 w-56">
              {previewUrls
                .slice(0, 3)
                .map((src, index) => (
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
                      rotate:
                        (index - 1) * 8,
                      scale: 1,
                    }}
                    whileHover={{
                      scale: 1.03,
                    }}
                    transition={{
                      delay:
                        0.9 + index * 0.15,
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
                      }px)) rotate(${
                        (index - 1) * 8
                      }deg)`,
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
                {uploadedPhotos.length}枚
              </span>
              の写真を
              <br />
              ギャラリーへ追加しました
            </p>
          </motion.div>

          {/* ---------------------------------------- */}
          {/* 共有する写真 */}
          {/* ---------------------------------------- */}

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
              mt-6
              w-full
            "
          >
            <p
              className="
                mb-3
                text-center
                text-sm
                font-semibold
                text-gray-900
              "
            >
              保存する画像を選択
            </p>

            {/* 写真グリッド */}
            <div
              className="
                grid
                w-full
                grid-cols-5
                gap-1.5
              "
            >
              {previewUrls.map((src, index) => {
                const isSelected =
                  selectedIndexes.includes(
                    index,
                  );

                return (
                  <button
                    key={src}
                    type="button"
                    onClick={() =>
                      togglePhoto(index)
                    }
                    className="
                      relative
                      aspect-square
                      overflow-hidden
                      rounded-xl
                      bg-gray-100
                    "
                  >
                    <img
                      src={src}
                      alt={`photo-${index + 1}`}
                      className="
                        h-full
                        w-full
                        object-cover
                      "
                    />

                    {isSelected && (
                      <div
                        className="
                          absolute
                          inset-0
                          bg-black/20
                        "
                      >
                        <div
                          className="
                            absolute
                            right-2
                            top-2
                            flex
                            h-7
                            w-7
                            items-center
                            justify-center
                            rounded-full
                            bg-black
                            text-sm
                            font-bold
                            text-white
                            shadow
                          "
                        >
                          ✓
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <p
              className="
                mt-3
                text-center
                text-xs
                text-gray-400
              "
            >
              {selectedIndexes.length}枚選択中
            </p>
          </motion.div>

          {/* ---------------------------------------- */}
          {/* アクションボタン */}
          {/* ---------------------------------------- */}

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
              delay: 1.2,
            }}
            className="
              mt-6
              mb-2
              w-full
              space-y-3
            "
          >
            {/* 共有 */}
            <motion.button
              whileTap={{
                scale: 0.96,
              }}
              onClick={handleShare}
              disabled={
                selectedIndexes.length === 0
              }
              className="
                flex
                h-14
                w-full
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
                disabled:cursor-not-allowed
                disabled:bg-gray-200
                disabled:text-gray-400
              "
            >
              <Share2 size={20} />
              選択した写真を保存
            </motion.button>

            {/* ギャラリー */}
            <motion.div whileTap={{ scale: 0.96 }}>
              <Link
                href={`/e/${eventToken}/photos`}
                className="
                  flex
                  h-14
                  w-full
                  items-center
                  justify-center
                  gap-2.5
                  rounded-2xl
                  border
                  border-gray-200
                  bg-white
                  text-sm
                  font-semibold
                  text-gray-700
                  shadow-sm
                  transition
                  hover:bg-gray-50
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

            {/* トップ */}
            <motion.div whileTap={{ scale: 0.96 }}>
              <button
                type="button"
                onClick={() => {
                  window.location.href =
                    `/e/${eventToken}`;
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
    </div>
  );
}
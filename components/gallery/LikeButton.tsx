"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

type Props = {
  eventToken: string;
  photoId: string;
};

export default function LikeButton({
  eventToken,
  photoId,
}: Props) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // ========================================
  // いいね情報取得
  // ========================================

  useEffect(() => {
    async function loadLikeInfo() {
      try {
        const response = await fetch(
          `/api/events/${eventToken}/likes?photoId=${encodeURIComponent(
            photoId
          )}`,
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          console.error(
            "Like info error:",
            data.error
          );
          return;
        }

        setLiked(data.liked);
        setCount(data.count);
      } catch (error) {
        console.error(
          "Like info fetch error:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadLikeInfo();
  }, [eventToken, photoId]);

  // ========================================
  // いいね / 解除
  // ========================================

  async function handleLike(
    event: React.MouseEvent
  ) {
    // PhotoCardのクリックイベントを止める
    event.stopPropagation();

    if (processing) {
      return;
    }

    setProcessing(true);

    // 楽観的更新
    const nextLiked = !liked;

    setLiked(nextLiked);
    setCount((prev) =>
      nextLiked
        ? prev + 1
        : Math.max(0, prev - 1)
    );

    try {
      const response = await fetch(
        `/api/events/${eventToken}/likes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            photoId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ?? "いいねに失敗しました"
        );
      }

      // APIの実際の状態に合わせる
      setLiked(data.liked);

      // 現在のいいね数を再取得
      const countResponse = await fetch(
        `/api/events/${eventToken}/likes?photoId=${encodeURIComponent(
          photoId
        )}`,
        {
          cache: "no-store",
        }
      );

      const countData =
        await countResponse.json();

      if (
        countResponse.ok &&
        countData.success
      ) {
        setCount(countData.count);
        setLiked(countData.liked);
      }
    } catch (error) {
      console.error(
        "Like error:",
        error
      );

      // API失敗時は元に戻す
      setLiked(liked);
      setCount((prev) =>
        liked
          ? prev + 1
          : Math.max(0, prev - 1)
      );
    } finally {
      setProcessing(false);
    }
  }

  // ========================================
  // Render
  // ========================================

  if (loading) {
    return (
      <div
        className="
          flex
          items-center
          gap-1
          text-xs
          text-white
        "
      >
        <Heart
          className="h-4 w-4"
        />
        <span>{count}</span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleLike}
      disabled={processing}
      aria-label={
        liked
          ? "いいねを取り消す"
          : "いいねする"
      }
      className="
        flex
        items-center
        gap-1
        rounded-full
        bg-white/90
        px-2
        py-1
        text-sm
        font-medium
        shadow-sm
        transition
        active:scale-90
        disabled:opacity-60
      "
    >
      <Heart
        className={`
          h-5
          w-5
          transition
          ${
            liked
              ? "fill-red-500 text-red-500"
              : "text-zinc-700"
          }
        `}
      />

      <span
        className="
          text-zinc-800
        "
      >
        {count}
      </span>
    </button>
  );
}
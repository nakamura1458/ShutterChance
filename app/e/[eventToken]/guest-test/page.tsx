"use client";

import { useEffect, useState } from "react";

type Props = {
  params: Promise<{
    eventToken: string;
  }>;
};

export default function GuestTestPage({ params }: Props) {
  const [eventToken, setEventToken] = useState("");
  const [guestId, setGuestId] = useState<string | null>(null);
  const [photoId, setPhotoId] = useState("");
  const [liked, setLiked] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      const { eventToken } = await params;

      setEventToken(eventToken);

      const response = await fetch(
        `/api/events/${eventToken}/guest`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (data.success) {
        setGuestId(data.guestId);
      }
    }

    load();
  }, [params]);

  async function handleLike() {
    if (!photoId) {
      setMessage("photoIdを入力してください");
      return;
    }

    setLoading(true);
    setMessage("");

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
        setMessage(data.error ?? "処理に失敗しました");
        return;
      }

      setLiked(data.liked);

      setMessage(
        data.liked
          ? "❤️ いいねしました"
          : "いいねを取り消しました"
      );
    } catch {
      setMessage("通信に失敗しました");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-8">
        いいね機能 確認ページ
      </h1>

      <div className="space-y-6 max-w-xl">
        <div>
          <p className="text-sm text-gray-500">
            Event Token
          </p>

          <p className="font-mono break-all">
            {eventToken}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Guest ID
          </p>

          <p className="font-mono break-all">
            {guestId ?? "取得中..."}
          </p>
        </div>

        <div>
          <label className="block text-sm text-gray-500 mb-2">
            Photo ID
          </label>

          <input
            type="text"
            value={photoId}
            onChange={(e) => setPhotoId(e.target.value)}
            placeholder="photos.id を入力"
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <button
          type="button"
          onClick={handleLike}
          disabled={loading}
          className="rounded-lg bg-black text-white px-5 py-3 disabled:opacity-50"
        >
          {loading
            ? "処理中..."
            : liked
              ? "💔 いいねを取り消す"
              : "❤️ いいねする"}
        </button>

        {liked !== null && (
          <p>
            現在の状態：
            {liked ? " ❤️ いいね済み" : " 🤍 未いいね"}
          </p>
        )}

        {message && (
          <p className="font-medium">
            {message}
          </p>
        )}
      </div>
    </main>
  );
}
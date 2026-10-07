"use client";

import { Share2, Copy, Check } from "lucide-react";
import { useState } from "react";

type Props = {
  guestUrl: string;
};

export default function ShareSection({
  guestUrl,
}: Props) {
  const [copied, setCopied] = useState(false);

  /**
   * イベントURLをシェア
   */
  const handleShareEvent = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "ShutterChance",
          text: "このイベントに参加して、写真をシェアしよう！",
          url: guestUrl,
        });

        return;
      }

      /*
       * Web Share API非対応の場合は
       * URLをコピー
       */
      await handleCopyUrl();
    } catch (error) {
      if ((error as Error).name === "AbortError") {
        return;
      }

      console.error("Event share failed:", error);
    }
  };

  /**
   * イベントURLをコピー
   */
  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(guestUrl);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  return (
    <section className="mt-10">
      <div className="border-t border-gray-200 pt-8">
        <h2 className="text-lg font-semibold text-gray-900">
          イベントを共有
        </h2>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          URLを使ってゲストにイベントを
          <br />
          直接共有することもできます。
        </p>

        {/* イベントをシェア */}
        <button
          type="button"
          onClick={handleShareEvent}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 active:scale-[0.98]"
        >
          <Share2 size={18} />
          このイベントをシェア
        </button>

        {/* URLをコピー */}
        <button
          type="button"
          onClick={handleCopyUrl}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-gray-500 transition hover:bg-gray-100 active:scale-[0.98]"
        >
          {copied ? (
            <>
              <Check size={18} />
              コピーしました
            </>
          ) : (
            <>
              <Copy size={18} />
              イベントURLをコピー
            </>
          )}
        </button>
      </div>
    </section>
  );
}
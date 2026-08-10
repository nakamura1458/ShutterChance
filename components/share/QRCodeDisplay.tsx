"use client";

import { useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Share2, Copy, Check } from "lucide-react";
import { toPng } from "html-to-image";

type Props = {
  guestUrl: string;
};

export default function QRCodeDisplay({ guestUrl }: Props) {
  const qrRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const [copied, setCopied] = useState(false);

  /**
   * カード全体をPNG画像にする
   */
  const createCardImage = async (): Promise<Blob | null> => {
    if (!cardRef.current) {
      return null;
    }

    const dataUrl = await toPng(cardRef.current, {
      pixelRatio: 3,
      cacheBust: true,
      backgroundColor: "#ffffff",
    });

    const response = await fetch(dataUrl);

    return await response.blob();
  };

  /**
   * カード全体をシェア
   */
  const handleShareCard = async () => {
    try {
      const blob = await createCardImage();

      if (!blob) {
        throw new Error("Card image could not be created.");
      }

      const file = new File(
        [blob],
        "shutterchance-card.png",
        {
          type: "image/png",
        },
      );

      if (
        navigator.share &&
        navigator.canShare?.({
          files: [file],
        })
      ) {
        await navigator.share({
          title: "Shutter Chance",
          text: "結婚式の写真投稿用QRカード",
          files: [file],
        });

        return;
      }

      // ファイル共有非対応の場合はURL共有
      if (navigator.share) {
        await navigator.share({
          title: "Shutter Chance",
          text: "結婚式の写真を送ってね！",
          url: guestUrl,
        });

        return;
      }

      // 最終フォールバック
      await navigator.clipboard.writeText(guestUrl);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      if ((error as Error).name === "AbortError") {
        return;
      }

      console.error("Card share failed:", error);
    }
  };

  /**
   * QRコードだけをシェア
   */
  const handleShareQr = async () => {
    try {
      const svg = qrRef.current?.querySelector("svg");

      if (!svg) {
        throw new Error("QR code not found.");
      }

      const svgData = new XMLSerializer().serializeToString(svg);

      const svgBlob = new Blob([svgData], {
        type: "image/svg+xml;charset=utf-8",
      });

      const svgUrl = URL.createObjectURL(svgBlob);

      try {
        const image = new Image();

        await new Promise<void>((resolve, reject) => {
          image.onload = () => resolve();
          image.onerror = () =>
            reject(new Error("QR image load failed"));

          image.src = svgUrl;
        });

        const canvas = document.createElement("canvas");

        const size = 1200;

        canvas.width = size;
        canvas.height = size;

        const context = canvas.getContext("2d");

        if (!context) {
          throw new Error("Canvas context unavailable.");
        }

        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, size, size);

        context.drawImage(
          image,
          0,
          0,
          size,
          size,
        );

        const blob = await new Promise<Blob | null>(
          (resolve) => {
            canvas.toBlob(
              (result) => resolve(result),
              "image/png",
              1,
            );
          },
        );

        if (!blob) {
          throw new Error("QR image could not be created.");
        }

        const file = new File(
          [blob],
          "shutterchance-qr.png",
          {
            type: "image/png",
          },
        );

        if (
          navigator.share &&
          navigator.canShare?.({
            files: [file],
          })
        ) {
          await navigator.share({
            title: "ShutterChance",
            text: "結婚式の写真を送ってね！",
            files: [file],
          });

          return;
        }

        if (navigator.share) {
          await navigator.share({
            title: "ShutterChance",
            text: "結婚式の写真を送ってね！",
            url: guestUrl,
          });

          return;
        }

        await navigator.clipboard.writeText(
          guestUrl,
        );

        setCopied(true);

        setTimeout(() => {
          setCopied(false);
        }, 2000);
      } finally {
        URL.revokeObjectURL(svgUrl);
      }
    } catch (error) {
      if ((error as Error).name === "AbortError") {
        return;
      }

      console.error("QR share failed:", error);
    }
  };


  /**
   * イベントそのものをシェア
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

      // Web Share API非対応の場合はURLをコピー
      await navigator.clipboard.writeText(guestUrl);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      // ユーザーが共有をキャンセルした場合
      if ((error as Error).name === "AbortError") {
        return;
      }

      console.error("Event share failed:", error);
    }
  };


  /**
   * URLをコピー
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
    <div className="mt-8">
      <h2 className="text-lg font-semibold">
        ゲスト用QRカード
      </h2>

      <p className="mt-2 text-sm text-gray-500">
        結婚式の会場やテーブルに置いて、
        ゲストに写真を送ってもらいましょう。
      </p>

      {/* カードプレビュー */}
      <div className="mt-6 flex justify-center">
        <div
          ref={cardRef}
          className="w-full max-w-sm overflow-hidden rounded-3xl bg-white px-8 py-10 text-center shadow-lg ring-1 ring-black/5"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">
            ShutterChance
          </p>

          <h3 className="mt-5 text-2xl font-bold tracking-tight text-gray-900">
            📸 写真を送ってね！
          </h3>

          <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-gray-500">
            今日撮った写真を
            <br />
            みんなでシェアしましょう。
          </p>

          <div
            ref={qrRef}
            className="mt-8 flex justify-center"
          >
            <QRCodeSVG
              value={guestUrl}
              size={220}
              level="H"
              bgColor="#ffffff"
              fgColor="#000000"
            />
          </div>

          <p className="mt-6 text-sm font-medium text-gray-700">
            スマホのカメラで読み取ってね
          </p>

          <p className="mt-2 text-xs text-gray-400">
            ShutterChance
          </p>
        </div>
      </div>

      {/* イベントをシェア */}
      <button
        type="button"
        onClick={handleShareEvent}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 active:scale-[0.98]"
      >
        <Share2 size={18} />
        このイベントをシェア
      </button>

      {/* カードをシェア */}
      <button
        type="button"
        onClick={handleShareCard}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 active:scale-[0.98]"
      >
        <Share2 size={18} />
        カードをシェア
      </button>

      {/* QRコードだけをシェア */}
      <button
        type="button"
        onClick={handleShareQr}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 active:scale-[0.98]"
      >
        <Share2 size={18} />
        QRコードだけをシェア
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
  );
}
"use client";

import { useRef, useState } from "react";
import { Download, Share2, Check } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { toPng } from "html-to-image";

type Props = {
  guestUrl: string;
};

export default function QRCodeDisplay({
  guestUrl,
}: Props) {
  const cardRef = useRef<HTMLDivElement>(null);

  const [isVisible, setIsVisible] = useState(false);
  const [shared, setShared] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  /**
   * カード全体をPNGのFileにする
   */
  const createCardFile = async (): Promise<File> => {
    if (!cardRef.current) {
      throw new Error(
        "Card image could not be created.",
      );
    }

    const dataUrl = await toPng(cardRef.current, {
      pixelRatio: 3,
      cacheBust: true,
      backgroundColor: "#ffffff",
    });

    const response = await fetch(dataUrl);

    if (!response.ok) {
      throw new Error(
        "Failed to create card image.",
      );
    }

    const blob = await response.blob();

    return new File(
      [blob],
      "shutterchance-qr-card.png",
      {
        type: "image/png",
      },
    );
  };

  /**
   * カード画像をシェア
   */
  const handleShareCard = async () => {
    try {
      const file = await createCardFile();

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

        setShared(true);

        setTimeout(() => {
          setShared(false);
        }, 2000);

        return;
      }

      // ファイル共有に対応していない場合はダウンロード
      await downloadFile(file);
    } catch (error) {
      if ((error as Error).name === "AbortError") {
        return;
      }

      console.error(
        "Card share failed:",
        error,
      );
    }
  };

  /**
   * カード画像をダウンロード
   */
  const handleDownloadCard = async () => {
    if (isDownloading) {
      return;
    }

    try {
      setIsDownloading(true);

      const file = await createCardFile();

      await downloadFile(file);
    } catch (error) {
      console.error(
        "Card download failed:",
        error,
      );
    } finally {
      setIsDownloading(false);
    }
  };

  /**
   * Fileをダウンロード
   */
  const downloadFile = async (
    file: File,
  ) => {
    const url =
      URL.createObjectURL(file);

    try {
      const link =
        document.createElement("a");

      link.href = url;
      link.download = file.name;

      document.body.appendChild(link);

      link.click();

      link.remove();
    } finally {
      URL.revokeObjectURL(url);
    }
  };

  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold text-gray-900">
        ゲスト用QRカード
      </h2>

      <p className="mt-2 text-sm leading-6 text-gray-500">
        結婚式の会場やテーブルに置いて、
        <br />
        ゲストに写真を送ってもらいましょう。
      </p>

      {/* 表示 / 非表示 */}
      <button
        type="button"
        onClick={() =>
          setIsVisible((current) => !current)
        }
        className="mt-5 flex w-full items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 active:scale-[0.98]"
      >
        {isVisible
          ? "ゲスト用QRカードを非表示"
          : "ゲスト用QRカードを表示"}
      </button>

      {isVisible && (
        <>
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

              <div className="mt-8 flex justify-center">
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

          {/* カードをシェア */}
          <button
            type="button"
            onClick={handleShareCard}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 active:scale-[0.98]"
          >
            {shared ? (
              <>
                <Check size={18} />
                共有しました
              </>
            ) : (
              <>
                <Share2 size={18} />
                カードをシェア
              </>
            )}
          </button>

          {/* カードをダウンロード */}
          <button
            type="button"
            onClick={handleDownloadCard}
            disabled={isDownloading}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download size={18} />

            {isDownloading
              ? "画像を作成中..."
              : "カードをダウンロード"}
          </button>
        </>
      )}
    </section>
  );
}
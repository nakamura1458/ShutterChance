"use client";

import { useRef, useState } from "react";
import { ExternalLink, Share2, Download, Check } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { toPng } from "html-to-image";

type Props = {
  guestUrl: string;
};

export default function BusinessCardGenerator({ guestUrl }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);

  const [isSharing, setIsSharing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [shared, setShared] = useState(false);

  /**
   * カード全体をPNG画像に変換
   */
  const createCardFile = async (): Promise<File> => {
    if (!cardRef.current) {
      throw new Error("QR card not found.");
    }

    const dataUrl = await toPng(cardRef.current, {
      pixelRatio: 3,
      cacheBust: true,
      backgroundColor: "#ffffff",
    });

    const response = await fetch(dataUrl);
    const blob = await response.blob();

    return new File([blob], "shutterchance-card.png", {
      type: "image/png",
    });
  };

  /**
   * カード全体をシェア
   */
  const handleShare = async () => {
    if (isSharing || isDownloading) return;

    try {
      setIsSharing(true);

      const file = await createCardFile();

      if (
        navigator.share &&
        navigator.canShare?.({ files: [file] })
      ) {
        await navigator.share({
          title: "Shutter Chance",
          text: "結婚式の写真投稿用QRカード",
          files: [file],
        });

        setShared(true);
        window.setTimeout(() => setShared(false), 2000);
        return;
      }

      // 画像共有に対応していない場合はイベントURLを共有
      if (navigator.share) {
        await navigator.share({
          title: "Shutter Chance",
          text: "結婚式の写真を送ってね！",
          url: guestUrl,
        });
        return;
      }

      // 共有機能に対応していない場合は画像をダウンロード
      downloadFile(file);
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        console.error("Card share failed:", error);
      }
    } finally {
      setIsSharing(false);
    }
  };

  /**
   * カード全体をダウンロード
   */
  const handleDownload = async () => {
    if (isDownloading || isSharing) return;

    try {
      setIsDownloading(true);
      const file = await createCardFile();
      downloadFile(file);
    } catch (error) {
      console.error("Card download failed:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  /**
   * PNG画像をダウンロード
   */
  const downloadFile = (file: File) => {
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");

    link.href = url;
    link.download = file.name;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  return (
    <section className="mt-6">
      <h2 className="text-lg font-semibold text-zinc-900">
        ゲスト用QRカード
      </h2>

      <p className="mt-2 text-sm leading-6 text-zinc-500">
        結婚式の会場やテーブルに置いて、
        ゲストに写真を送ってもらいましょう。
      </p>

      {/* QRカードのプレビュー */}
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
        onClick={handleShare}
        disabled={isSharing || isDownloading}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]"
      >
        {shared ? (
          <>
            <Check size={18} />
            シェアしました
          </>
        ) : (
          <>
            <Share2 size={18} />
            {isSharing ? "準備中..." : "カードをシェア"}
          </>
        )}
      </button>

      {/* カードをダウンロード */}
      <button
        type="button"
        onClick={handleDownload}
        disabled={isDownloading || isSharing}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]"
      >
        <Download size={18} />
        {isDownloading ? "画像を作成中..." : "カードをダウンロード"}
      </button>

      <p className="mt-3 text-center text-xs leading-5 text-zinc-500">
        PNG画像として保存し、印刷してご利用いただけます。
      </p>

      {/* Canvaテンプレートへのリンク（必要な場合のみ利用） */}
      <a
        href="https://www.canva.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 flex items-center justify-center gap-1 text-xs text-zinc-400 transition hover:text-zinc-600"
      >
        Canvaで編集する
        <ExternalLink size={12} />
      </a>
    </section>
  );
}
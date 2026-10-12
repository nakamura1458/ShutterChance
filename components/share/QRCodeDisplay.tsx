
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
  const qrRef = useRef<HTMLDivElement>(null);

  const [shared, setShared] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  /**
   * QRコードのみをPNG画像にする
   */
  const createQRFile = async (): Promise<File> => {
    if (!qrRef.current) {
      throw new Error("QR code image could not be created.");
    }

    const dataUrl = await toPng(qrRef.current, {
      pixelRatio: 3,
      cacheBust: true,
      backgroundColor: "#ffffff",
    });

    const response = await fetch(dataUrl);

    if (!response.ok) {
      throw new Error("Failed to create QR code image.");
    }

    const blob = await response.blob();

    return new File([blob], "shutterchance-qr.png", {
      type: "image/png",
    });
  };

  /**
   * QRコード画像をシェア
   */
  const handleShareQR = async () => {
    try {
      const file = await createQRFile();

      if (
        navigator.share &&
        navigator.canShare?.({ files: [file] })
      ) {
        await navigator.share({
          title: "Shutter Chance QRコード",
          files: [file],
        });

        setShared(true);
        window.setTimeout(() => setShared(false), 2000);
        return;
      }

      await downloadFile(file);
    } catch (error) {
      if ((error as Error).name === "AbortError") {
        return;
      }

      console.error("QR code share failed:", error);
    }
  };

  /**
   * QRコード画像をダウンロード
   */
  const handleDownloadQR = async () => {
    if (isDownloading) return;

    try {
      setIsDownloading(true);
      const file = await createQRFile();
      await downloadFile(file);
    } catch (error) {
      console.error("QR code download failed:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  /**
   * PNGファイルをダウンロード
   */
  const downloadFile = async (file: File) => {
    const url = URL.createObjectURL(file);

    try {
      const link = document.createElement("a");
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
    <section>
      <h2 className="text-lg font-semibold text-gray-900">
        ゲスト用QRコード
      </h2>

      <p className="mt-2 text-sm leading-6 text-gray-500">
        ゲストが写真を投稿するためのQRコードです。
      </p>

      {/* QRコードを常時表示 */}
      <div className="mt-6 flex justify-center">
        <div
          ref={qrRef}
          className="inline-flex bg-white p-3"
        >
          <QRCodeSVG
            value={guestUrl}
            size={260}
            level="H"
            bgColor="#ffffff"
            fgColor="#000000"
          />
        </div>
      </div>

      {/* QRコードをシェア */}
      <button
        type="button"
        onClick={handleShareQR}
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
            QRコードをシェア
          </>
        )}
      </button>

      {/* QRコードをダウンロード */}
      <button
        type="button"
        onClick={handleDownloadQR}
        disabled={isDownloading}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Download size={18} />

        {isDownloading
          ? "画像を作成中..."
          : "QRコードをダウンロード"}
      </button>
    </section>
  );
}

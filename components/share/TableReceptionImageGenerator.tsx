// components/share/TableReceptionImageGenerator.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Download, Share2 } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

type Props = {
  guestUrl: string;
};

const TEMPLATE = {
  image: "/share/templates/reception-table.png",
  fileName: "shutterchance-reception-table.png",
  label: "卓上用画像",
  description: "QRコード入り卓上用画像",
  qrSize: 480,
  qrPosition: { x: 0.5, y: 0.523 },
  aspectRatio: "182 / 257",
} as const;

type GeneratedImage = {
  file: File;
  url: string;
};

export default function TableReceptionImageGenerator({
  guestUrl,
}: Props) {
  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let cancelled = false;
    let objectUrl: string | null = null;

    const generate = async () => {
      try {
        const qrCanvas = qrCanvasRef.current;

        if (!qrCanvas) {
          throw new Error("QRコードを生成できませんでした。");
        }

        const template = new Image();
        template.src = TEMPLATE.image;

        await new Promise<void>((resolve, reject) => {
          template.onload = () => resolve();
          template.onerror = () =>
            reject(new Error("卓上用テンプレートを読み込めませんでした。"));

          if (template.complete && template.naturalWidth > 0) {
            resolve();
          }
        });

        if (cancelled) return;

        const width = template.naturalWidth;
        const height = template.naturalHeight;
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext("2d");
        if (!context) {
          throw new Error("画像を作成できませんでした。");
        }

        context.drawImage(template, 0, 0, width, height);

        const qrX = width * TEMPLATE.qrPosition.x - TEMPLATE.qrSize / 2;
        const qrY = height * TEMPLATE.qrPosition.y - TEMPLATE.qrSize / 2;

        context.drawImage(
          qrCanvas,
          qrX,
          qrY,
          TEMPLATE.qrSize,
          TEMPLATE.qrSize,
        );

        const blob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob(resolve, "image/png");
        });

        if (!blob) {
          throw new Error("PNG画像を作成できませんでした。");
        }

        if (cancelled) return;

        const file = new File([blob], TEMPLATE.fileName, {
          type: "image/png",
        });

        objectUrl = URL.createObjectURL(file);
        setGeneratedImage({ file, url: objectUrl });
      } catch (error) {
        console.error("卓上用画像の生成に失敗しました:", error);
        if (!cancelled) {
          setErrorMessage(
            "画像を作成できませんでした。ページを再読み込みしてお試しください。",
          );
        }
      }
    };

    void generate();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, []);

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

  const handleShare = async () => {
    if (!generatedImage || isProcessing) return;

    try {
      setIsProcessing(true);

      if (
        navigator.share &&
        navigator.canShare?.({ files: [generatedImage.file] })
      ) {
        await navigator.share({
          title: "Shutter Chance",
          text: TEMPLATE.label,
          files: [generatedImage.file],
        });
        setIsShared(true);
        window.setTimeout(() => setIsShared(false), 2000);
      } else {
        downloadFile(generatedImage.file);
      }
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        console.error("卓上用画像の共有に失敗しました:", error);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage || isProcessing) return;

    setIsProcessing(true);
    try {
      downloadFile(generatedImage.file);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[9999px] top-0"
      >
        <QRCodeCanvas
          value={guestUrl}
          size={TEMPLATE.qrSize}
          level="H"
          bgColor="#ffffff"
          fgColor="#000000"
          ref={qrCanvasRef}
        />
      </div>

      <h2 className="text-lg font-semibold text-gray-900">
        卓上用画像
      </h2>
      <p className="mt-2 text-sm leading-6 text-gray-500">
        QRコード入りの受付用画像です。
        <br />
        印刷してテーブルに置いたり、そのまま共有できます。
      </p>

      <div className="mt-6 flex justify-center">
        {generatedImage ? (
          <img
            src={generatedImage.url}
            alt="QRコード入り卓上用画像"
            className="w-full max-w-sm rounded-xl shadow-sm"
          />
        ) : (
          <div
            className="flex w-full max-w-sm items-center justify-center rounded-xl bg-gray-100 text-sm text-gray-500"
            style={{ aspectRatio: TEMPLATE.aspectRatio }}
          >
            {errorMessage || "画像を作成中..."}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={handleShare}
        disabled={isProcessing || !generatedImage}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isShared ? (
          <>
            <Check size={18} />
            共有しました
          </>
        ) : (
          <>
            <Share2 size={18} />
            {isProcessing ? "処理中..." : "卓上用画像をシェア"}
          </>
        )}
      </button>

      <button
        type="button"
        onClick={handleDownload}
        disabled={isProcessing || !generatedImage}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Download size={18} />
        卓上用画像をダウンロード
      </button>
    </section>
  );
}
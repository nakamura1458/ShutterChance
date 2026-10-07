"use client";

import { useState } from "react";
import { Download, Share2, Check } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

type Props = {
  guestUrl: string;
};

const TEMPLATES = {
  reception: {
    image: "/share/templates/reception-table.png",
    fileName: "shutterchance-reception-table.png",
    label: "卓上用画像",
    description: "QRコードを埋め込んだ受付用画像です。",
    aspectRatio: "176 / 250",
    qrSize: 240,
    qrPosition: {
      x: 0.5,
      y: 0.523,
    },
  },
  allGuest: {
    image: "/share/templates/reception-all-guest.png",
    fileName: "shutterchance-reception-all-guest.png",
    label: "全体表示用画像",
    description:
      "QRコードを埋め込んだ全体表示用画像です。",
    aspectRatio: "1024 / 1536",
    qrSize: 174,
    qrPosition: {
      x: 0.5,
      y: 0.81,
    },
  },
} as const;

type TemplateType = keyof typeof TEMPLATES;

export default function ReceptionImageGenerator({
  guestUrl,
}: Props) {
  const [visibleTemplate, setVisibleTemplate] =
    useState<TemplateType | null>(null);

  const [isProcessing, setIsProcessing] =
    useState(false);

  const [sharedTemplate, setSharedTemplate] =
    useState<TemplateType | null>(null);

  /**
   * テンプレート画像＋イベント専用QRコードを
   * 1枚のPNG画像として生成
   */
  const createImageFile = async (
    type: TemplateType,
  ): Promise<File> => {
    const config = TEMPLATES[type];

    /*
     * テンプレート画像を読み込む
     */
    const template = new Image();

    template.src = config.image;

    await new Promise<void>((resolve, reject) => {
      template.onload = () => resolve();

      template.onerror = () =>
        reject(
          new Error(
            "Template image could not be loaded.",
          ),
        );
    });

    /*
     * 元画像のサイズを取得
     */
    const width = template.naturalWidth;
    const height = template.naturalHeight;

    if (!width || !height) {
      throw new Error(
        "Template image size could not be determined.",
      );
    }

    /*
     * Canvas
     */
    const canvas =
      document.createElement("canvas");

    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error(
        "Canvas context unavailable.",
      );
    }

    /*
     * テンプレート画像を描画
     */
    context.drawImage(
      template,
      0,
      0,
      width,
      height,
    );

    /*
     * QRコードSVGを取得
     */
    const qrContainer =
      document.querySelector(
        `[data-reception-qr="${type}"]`,
      );

    const qrSvg =
      qrContainer?.querySelector("svg");

    if (!qrSvg) {
      throw new Error(
        "QR code could not be found.",
      );
    }

    /*
     * SVG → Blob
     */
    const svgData =
      new XMLSerializer().serializeToString(
        qrSvg,
      );

    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });

    const svgUrl =
      URL.createObjectURL(svgBlob);

    try {
      /*
       * SVG → Image
       */
      const qrImage = new Image();

      qrImage.src = svgUrl;

      await new Promise<void>(
        (resolve, reject) => {
          qrImage.onload = () => resolve();

          qrImage.onerror = () =>
            reject(
              new Error(
                "QR image could not be loaded.",
              ),
            );
        },
      );

      /*
       * QRコードサイズ
       */
      const qrSize = config.qrSize;

      /*
       * QRコード位置
       */
      const qrX =
        width * config.qrPosition.x -
        qrSize / 2;

      const qrY =
        height * config.qrPosition.y -
        qrSize / 2;

      /*
       * QRコードをテンプレートに合成
       */
      context.drawImage(
        qrImage,
        qrX,
        qrY,
        qrSize,
        qrSize,
      );
    } finally {
      URL.revokeObjectURL(svgUrl);
    }

    /*
     * Canvas → PNG
     */
    const blob =
      await new Promise<Blob | null>(
        (resolve) => {
          canvas.toBlob(
            (result) => resolve(result),
            "image/png",
            1,
          );
        },
      );

    if (!blob) {
      throw new Error(
        "Reception image could not be created.",
      );
    }

    return new File(
      [blob],
      config.fileName,
      {
        type: "image/png",
      },
    );
  };

  /**
   * 画像をシェア
   */
  const handleShare = async (
    type: TemplateType,
  ) => {
    if (isProcessing) {
      return;
    }

    try {
      setIsProcessing(true);

      const file =
        await createImageFile(type);

      /*
       * ファイル共有対応
       */
      if (
        navigator.share &&
        navigator.canShare?.({
          files: [file],
        })
      ) {
        await navigator.share({
          title: "ShutterChance",
          text: TEMPLATES[type].label,
          files: [file],
        });

        setSharedTemplate(type);

        setTimeout(() => {
          setSharedTemplate(null);
        }, 2000);

        return;
      }

      /*
       * ファイル共有非対応の場合
       * ダウンロード
       */
      await downloadFile(file);
    } catch (error) {
      if (
        (error as Error).name ===
        "AbortError"
      ) {
        return;
      }

      console.error(
        "Reception image share failed:",
        error,
      );
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * 画像をダウンロード
   */
  const handleDownload = async (
    type: TemplateType,
  ) => {
    if (isProcessing) {
      return;
    }

    try {
      setIsProcessing(true);

      const file =
        await createImageFile(type);

      await downloadFile(file);
    } catch (error) {
      console.error(
        "Reception image download failed:",
        error,
      );
    } finally {
      setIsProcessing(false);
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
    <section className="mt-10">
      <div className="border-t border-gray-200 pt-8">
        <h2 className="text-lg font-semibold text-gray-900">
          卓上用画像
        </h2>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          QRコードを埋め込んだ受付用画像です。
          <br />
          印刷したり、そのまま共有できます。
        </p>

        {/* 卓上用画像を表示 */}
        <button
          type="button"
          onClick={() =>
            setVisibleTemplate(
              (current) =>
                current === "reception"
                  ? null
                  : "reception",
            )
          }
          className="mt-5 flex w-full items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 active:scale-[0.98]"
        >
          {visibleTemplate === "reception"
            ? "卓上用画像を非表示"
            : "卓上用画像を表示"}
        </button>

        {visibleTemplate ===
          "reception" && (
          <>
            {/* 卓上用画像 */}
            <div className="mt-6 flex justify-center">
              <div
                className="relative w-full max-w-sm overflow-hidden bg-white"
                style={{
                  aspectRatio:
                    TEMPLATES.reception
                      .aspectRatio,
                }}
              >
                <img
                  src={
                    TEMPLATES.reception.image
                  }
                  alt="卓上用テンプレート"
                  className="absolute inset-0 h-full w-full object-cover"
                />

                <div
                  data-reception-qr="reception"
                  className="absolute"
                  style={{
                    left: "50%",
                    top: "52.3%",
                    transform:
                      "translate(-50%, -50%)",
                  }}
                >
                  <QRCodeSVG
                    value={guestUrl}
                    size={80}
                    level="H"
                    bgColor="#ffffff"
                    fgColor="#000000"
                  />
                </div>
              </div>
            </div>

            {/* シェア */}
            <button
              type="button"
              onClick={() =>
                handleShare("reception")
              }
              disabled={isProcessing}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {sharedTemplate ===
              "reception" ? (
                <>
                  <Check size={18} />
                  共有しました
                </>
              ) : (
                <>
                  <Share2 size={18} />
                  {isProcessing
                    ? "画像を作成中..."
                    : "卓上用画像をシェア"}
                </>
              )}
            </button>

            {/* ダウンロード */}
            <button
              type="button"
              onClick={() =>
                handleDownload("reception")
              }
              disabled={isProcessing}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download size={18} />

              {isProcessing
                ? "画像を作成中..."
                : "卓上用画像をダウンロード"}
            </button>
          </>
        )}

        {/* 全体表示用画像 */}
        <div className="mt-10 border-t border-gray-100 pt-8">
          <h2 className="text-lg font-semibold text-gray-900">
            全体表示用画像
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            QRコードを埋め込んだ全体表示用画像です。
            <br />
            会場のスクリーンなどで表示できます。
          </p>

          {/* 表示ボタン */}
          <button
            type="button"
            onClick={() =>
              setVisibleTemplate(
                (current) =>
                  current === "allGuest"
                    ? null
                    : "allGuest",
              )
            }
            className="mt-5 flex w-full items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 active:scale-[0.98]"
          >
            {visibleTemplate ===
            "allGuest"
              ? "全体表示用画像を非表示"
              : "全体表示用画像を表示"}
          </button>

          {visibleTemplate ===
            "allGuest" && (
            <>
              {/* 全体表示用画像 */}
              <div className="mt-6 flex justify-center">
                <div
                  className="relative w-full overflow-hidden bg-white"
                  style={{
                    aspectRatio:
                      TEMPLATES.allGuest
                        .aspectRatio,
                  }}
                >
                  <img
                    src={
                      TEMPLATES.allGuest.image
                    }
                    alt="全体表示用テンプレート"
                    className="absolute inset-0 h-full w-full object-cover"
                  />

                  <div
                    data-reception-qr="allGuest"
                    className="absolute"
                    style={{
                      left: "50%",
                      top: "81%",
                      transform:
                        "translate(-50%, -50%)",
                    }}
                  >
                    <QRCodeSVG
                      value={guestUrl}
                      size={70}
                      level="H"
                      bgColor="#ffffff"
                      fgColor="#000000"
                    />
                  </div>
                </div>
              </div>

              {/* シェア */}
              <button
                type="button"
                onClick={() =>
                  handleShare("allGuest")
                }
                disabled={isProcessing}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {sharedTemplate ===
                "allGuest" ? (
                  <>
                    <Check size={18} />
                    共有しました
                  </>
                ) : (
                  <>
                    <Share2 size={18} />
                    {isProcessing
                      ? "画像を作成中..."
                      : "全体表示用画像をシェア"}
                  </>
                )}
              </button>

              {/* ダウンロード */}
              <button
                type="button"
                onClick={() =>
                  handleDownload("allGuest")
                }
                disabled={isProcessing}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Download size={18} />

                {isProcessing
                  ? "画像を作成中..."
                  : "全体表示用画像をダウンロード"}
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
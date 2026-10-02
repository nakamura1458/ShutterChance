"use client";

import { useState } from "react";
import { Download } from "lucide-react";

import { downloadBulkPhotos } from "@/lib/utils/downloadBulkPhotos";

type Props = {
  eventToken: string;
  guestNames?: string[];
  photoCount: number;
};

export default function PhotoBulkDownloadButton({
  eventToken,
  guestNames = [],
  photoCount,
}: Props) {
  const [isDownloading, setIsDownloading] =
    useState(false);

  async function handleDownload() {
    if (photoCount === 0 || isDownloading) {
      return;
    }

    const confirmed = window.confirm(
      `${photoCount}枚の写真をZIPファイルにまとめて保存します。\n\n処理に少し時間がかかる場合があります。`
    );

    if (!confirmed) {
      return;
    }

    setIsDownloading(true);

    try {
      await downloadBulkPhotos(
        eventToken,
        guestNames
      );
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={
        photoCount === 0 ||
        isDownloading
      }
      className="
        inline-flex
        items-center
        gap-1.5
        rounded-full
        border
        bg-background
        px-3
        py-2
        text-sm
        font-medium
        shadow-sm
        transition
        active:scale-95
        disabled:cursor-not-allowed
        disabled:opacity-50
      "
    >
      <Download className="h-4 w-4" />

      <span>
        {isDownloading
          ? "保存中..."
          : "一括保存"}
      </span>
    </button>
  );
}
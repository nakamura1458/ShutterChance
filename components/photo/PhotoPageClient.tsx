"use client";

import { useState } from "react";
import Link from "next/link";

import PhotoUpload from "./PhotoUpload";
import PhotoList from "@/components/gallery/PhotoList";
import { fetchPhotos } from "@/actions/photo.actions";

import type { PhotoListItem } from "@/types/photo";

type Props = {
  eventId: string;
  eventToken: string;
  initialPhotos: PhotoListItem[];
  eventStartAt: string | null;
  eventDeadline: string | null;
};

export default function PhotoPageClient({
  eventId,
  eventToken,
  initialPhotos,
  eventStartAt,
  eventDeadline,
}: Props) {
  const [photos, setPhotos] =
    useState(initialPhotos);

  async function reloadPhotos() {
    const latest = await fetchPhotos(eventId);
    setPhotos(latest);
  }

  // ----------------------------------------
  // イベント状態
  // ----------------------------------------

  const now = Date.now();

  const isBeforeEvent =
    eventStartAt &&
    new Date(eventStartAt).getTime() > now;

  const isEventEnded =
    eventDeadline &&
    new Date(eventDeadline).getTime() <= now;

  const canUpload =
    !isBeforeEvent && !isEventEnded;

  return (
    <>
      {/* ---------------------------------------- */}
      {/* 写真アップロード */}
      {/* ---------------------------------------- */}

      {canUpload ? (
        <PhotoUpload
          eventId={eventId}
          eventToken={eventToken}
          onUploadSuccess={reloadPhotos}
        />
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-10 text-center">
          {isBeforeEvent ? (
            <>
              <p className="text-base font-semibold text-gray-900">
                イベントはまだ開始されていません
              </p>

              <p className="mt-2 text-sm text-gray-500">
                イベント開始後に写真をアップロードできます。
              </p>
            </>
          ) : (
            <>
              <p className="text-base font-semibold text-gray-900">
                イベントは終了しました
              </p>

              <p className="mt-2 text-sm text-gray-500">
                写真のアップロード受付は終了しています。
              </p>
            </>
          )}
        </div>
      )}

      {/* ---------------------------------------- */}
      {/* 写真一覧 */}
      {/* ---------------------------------------- */}

      <div className="space-y-3">
        <PhotoList
          photos={photos.slice(0, 12)}
        />

        {photos.length > 12 && (
          <div className="pr-1 text-right">
            <Link
              href={`/e/${eventToken}/photos`}
              className="
                text-sm
                font-medium
                text-blue-600
              "
            >
              すべて見る →
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
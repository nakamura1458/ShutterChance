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
};

export default function PhotoPageClient({
  eventId,
  eventToken,
  initialPhotos,
}: Props) {

  const [photos, setPhotos] =
    useState(initialPhotos);

  async function reloadPhotos() {
    const latest = await fetchPhotos(eventId);
    setPhotos(latest);
  }

  return (
    <>
      <PhotoUpload
        eventId={eventId}
        eventToken={eventToken}
        onUploadSuccess={reloadPhotos}
      />

      <div className="space-y-3">
        <PhotoList
          photos={photos.slice(0, 12)}
        />

        {photos.length > 12 && (
          <div className="text-center">
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
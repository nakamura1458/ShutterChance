"use client";

import { useState } from "react";

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

      <PhotoList
        photos={photos}
      />
    </>
  );
}
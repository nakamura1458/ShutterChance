"use client";

// components
import PhotoScreen from "./PhotoScreen";
import UploadStartCard from "./start/UploadStartCard";
import ImagePicker from "./picker/ImagePicker";

// hooks
import { useGuestName } from "@/hooks/useGuestName";
import { usePhotoFlow } from "@/hooks/usePhotoFlow";

// 装飾系
import { useEffect, useState, useRef } from "react";

type Props = {
  eventId: string;
  eventToken: string;
  onUploadSuccess?: () => void;
};

export default function PhotoUpload({
  eventId,
  eventToken,
  onUploadSuccess,
}: Props) {
  const [selected, setSelected] = useState(false);

  const flow = usePhotoFlow({
    eventId,
    eventToken,
  });

  const imagePickerRef = useRef<HTMLInputElement>(null);

  const { guestName, saveGuestName, clearGuestName } =
    useGuestName(eventToken);

  const [guestNameDraft, setGuestNameDraft] = useState("");

  const [adding, setAdding] = useState(false);

  useEffect(() => {
    setGuestNameDraft(guestName);
  }, [guestName]);

  const handleSelectPhoto = (files: File[]) => {
    if (adding) {
      flow.actions.addPhotos(files);
      setAdding(false);
      return;
    }

    flow.actions.setPhotos(files);
    setSelected(true);
  };

  const handleAddPhoto = (files: File[]) => {
    flow.actions.addPhotos(files);
  };

  const openPicker = () => {
    imagePickerRef.current?.click();
  };

  const openAddPicker = () => {
    setAdding(true);
    imagePickerRef.current?.click();
  };

  const handleUpload = async () => {
    const name = guestName.trim();

    const success = await flow.actions.upload(name);

    if (!success) {
      alert(flow.state.error?.message ?? "送信失敗");
      return;
    }

    onUploadSuccess?.();
  };

  return (
    <>
      {/* ← 常に存在させる */}
      <ImagePicker
        ref={imagePickerRef}
        onSelect={handleSelectPhoto}
      />

      {selected ? (
        <PhotoScreen
          flow={flow}
          onUpload={handleUpload}
          onViewPhotos={() => {
            requestAnimationFrame(() => {
              document
                .getElementById("photo-list")
                ?.scrollIntoView({
                  behavior: "smooth",
                });
            });
          }}
          onSelectPhoto={openAddPicker}
        />
      ) : (
        <UploadStartCard
          guestName={guestName}
          guestNameDraft={guestNameDraft}
          onGuestNameChange={setGuestNameDraft}
          onSaveGuestName={saveGuestName}
          onClearGuestName={clearGuestName}
          onSelectPhoto={openPicker}
        />
      )}
    </>
  );
}
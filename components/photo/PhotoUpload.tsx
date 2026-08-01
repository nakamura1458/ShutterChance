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

  useEffect(() => {
    setGuestNameDraft(guestName);
  }, [guestName]);

  const handleSelectPhoto = (file: File) => {
    flow.actions.setPhoto(file);
    setSelected(true);
};

  const openPicker = () => {
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
    // router.refresh();
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
          onSelectPhoto={openPicker}
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
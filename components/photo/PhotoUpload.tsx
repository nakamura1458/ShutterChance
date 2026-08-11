"use client";

import { useEffect, useRef, useState } from "react";

// components
import PhotoScreen from "./PhotoScreen";
import UploadStartCard from "./start/UploadStartCard";
import ImagePicker from "./picker/ImagePicker";

// hooks
import { useGuestName } from "@/hooks/useGuestName";
import { usePhotoFlow } from "@/hooks/usePhotoFlow";

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
  // ----------------------------------------
  // Photo Flow
  // ----------------------------------------

  const flow = usePhotoFlow({
    eventId,
    eventToken,
  });

  // ----------------------------------------
  // UI State
  // ----------------------------------------

  const [selected, setSelected] = useState(false);

  const [guestNameDraft, setGuestNameDraft] =
    useState("");

  const [uploadedPhotos, setUploadedPhotos] =
    useState<File[]>([]);

  // ----------------------------------------
  // Refs
  // ----------------------------------------

  const imagePickerRef =
    useRef<HTMLInputElement>(null);

  // ----------------------------------------
  // Guest Name
  // ----------------------------------------

  const {
    guestName,
    saveGuestName,
    clearGuestName,
  } = useGuestName(eventToken);

  useEffect(() => {
    setGuestNameDraft(guestName);
  }, [guestName]);

  // ----------------------------------------
  // 写真選択
  // ----------------------------------------

  const handleSelectPhoto = (files: File[]) => {
    if (!selected) {
      flow.actions.setPhotos(files);
      setSelected(true);
      return;
    }

    flow.actions.addPhotos(files);
  };

  // ----------------------------------------
  // Picker
  // ----------------------------------------

  const openPicker = () => {
    imagePickerRef.current?.click();
  };

  const openAddPicker = () => {
    flow.actions.resetStatus();
    imagePickerRef.current?.click();
  };

  // ----------------------------------------
  // Upload
  // ----------------------------------------

  const handleUpload = async () => {
    const name = guestNameDraft.trim();

    if (!name) {
      alert("名前を入力してください。");
      return;
    }

    // ----------------------------------------
    // アップロード
    // ----------------------------------------

    const result = await flow.actions.upload(name);

    // ----------------------------------------
    // 全失敗
    // ----------------------------------------

    if (result.uploadedPhotos.length === 0) {
      alert(
        result.error?.message ??
          "写真の送信に失敗しました。",
      );

      return;
    }

    // ----------------------------------------
    // 実際に成功した写真だけ保持
    // ----------------------------------------

    setUploadedPhotos(result.uploadedPhotos);

    // ----------------------------------------
    // 選択中の写真をクリア
    // ----------------------------------------

    flow.actions.clearSelectedPhotos();

    // ----------------------------------------
    // 一部失敗
    // ----------------------------------------

    if (result.failedPhotos.length > 0) {
      alert(
        `${result.uploadedPhotos.length}枚アップロードしました。\n` +
          `${result.failedPhotos.length}枚はアップロードできませんでした。`,
      );
    }

    // ----------------------------------------
    // 完了
    // ----------------------------------------

    onUploadSuccess?.();
  };

  // ----------------------------------------
  // 写真選択をクリア
  // ----------------------------------------

  const handleClear = () => {
    flow.actions.clearPhotos();
    setSelected(false);
    setUploadedPhotos([]);
  };

  // ----------------------------------------
  // Render
  // ----------------------------------------

  return (
    <>
      {/* ----------------------------------------
          Image Picker
      ---------------------------------------- */}

      <ImagePicker
        ref={imagePickerRef}
        onSelect={handleSelectPhoto}
      />

      {/* ----------------------------------------
          Photo Selection / Upload
      ---------------------------------------- */}

      {selected ? (
        <PhotoScreen
          flow={flow}
          uploadedPhotos={uploadedPhotos}
          eventToken={eventToken}
          onUpload={handleUpload}
          onClear={handleClear}
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
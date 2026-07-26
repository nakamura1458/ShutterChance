"use client";

// components
import CameraScreen from "./CameraScreen";
import CameraStartCard from "./start/CameraStartCard";
import ImagePicker from "./picker/ImagePicker";

// hooks
import { useGuestName } from "@/hooks/useGuestName";
import { useCameraFlow } from "@/hooks/useCameraFlow";

// 装飾系
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

type Props = {
  eventId: string;
  eventToken: string;
};

export default function CameraUpload({
  eventId,
  eventToken,
}: Props) {
  const [started, setStarted] = useState(false);

  const router = useRouter();

  const flow = useCameraFlow({
    eventId,
    eventToken,
    enabled: started,
  });

  const imagePickerRef = useRef<HTMLInputElement>(null);

  const { guestName, saveGuestName, clearGuestName } =
    useGuestName(eventToken);

  const [guestNameDraft, setGuestNameDraft] = useState("");

  useEffect(() => {
    setGuestNameDraft(guestName);
  }, [guestName]);

  useEffect(() => {
    const isCameraOpen =
      started &&
      !flow.state.capturedPhoto &&
      flow.state.status !== "success";

    document.body.style.overflow = isCameraOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [
    started,
    flow.state.capturedPhoto,
    flow.state.status,
  ]);

  const handleSelectPhoto = (file: File) => {
    flow.actions.setPhoto(file);
    setStarted(true);
  };

  const openPicker = () => {
    imagePickerRef.current?.click();
  };

  const handleUpload = async () => {
    const name = guestName.trim();

    const success = await flow.actions.upload(name);

    if (!success) {
      alert(flow.state.error?.message ?? "送信失敗");
    }
  };

  return (
    <>
      {/* ← 常に存在させる */}
      <ImagePicker
        ref={imagePickerRef}
        onSelect={handleSelectPhoto}
      />

      {started ? (
        <CameraScreen
          flow={flow}
          onUpload={handleUpload}
          onClose={async () => {
            await flow.actions.retakePhoto();
            setStarted(false);
          }}
          onViewPhotos={() => {
            router.refresh();

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
        <CameraStartCard
          guestName={guestName}
          guestNameDraft={guestNameDraft}
          onGuestNameChange={setGuestNameDraft}
          onSaveGuestName={saveGuestName}
          onClearGuestName={clearGuestName}
          onStart={() => setStarted(true)}
          onSelectPhoto={openPicker}
        />
      )}

      <canvas
        ref={flow.refs.canvasRef}
        hidden
      />
    </>
  );
}
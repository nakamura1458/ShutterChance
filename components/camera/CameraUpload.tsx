"use client";

// components
import CameraScreen from "./CameraScreen";
import CameraStartCard from "./start/CameraStartCard"

// hooks
import { useGuestName } from "@/hooks/useGuestName";
import { useCameraFlow } from "@/hooks/useCameraFlow";

// 装飾系のインポート
import { useEffect, useState } from "react";
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


  const handleUpload = async () => {
    const name = guestName.trim();

    const success = await flow.actions.upload(name);

    if (!success) {
      alert(
        flow.state.error?.message ??
        "送信失敗"
      );

      return;
    }

  };

  const { guestName, saveGuestName, clearGuestName} = useGuestName(eventToken);
  const [guestNameDraft, setGuestNameDraft] = useState("");

  useEffect(() => {
    const isCameraOpen =
      started &&
      !flow.state.capturedPhoto &&
      flow.state.status !== "success";

    if (isCameraOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }


    return () => {
      document.body.style.overflow = "";
    };

  }, [
    started,
    flow.state.capturedPhoto,
    flow.state.status,
  ]);

  useEffect(() => {
    setGuestNameDraft(guestName);
  }, [guestName]);

  if (started) {
    return (
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
      />
    );
  }

  // ===========================
  // Initial
  // ===========================
  return (
    <>
      <CameraStartCard
        guestName={guestName}
        guestNameDraft={guestNameDraft}
        onGuestNameChange={setGuestNameDraft}
        onSaveGuestName={saveGuestName}
        onClearGuestName={clearGuestName}
        onStart={() => setStarted(true)}
      />

      <canvas
        ref={flow.refs.canvasRef}
        hidden
      />
    </>
  );
}
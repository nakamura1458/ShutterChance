"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import CameraView from "@/components/camera/CameraView";
import CaptureButton from "@/components/camera/CaptureButton";
import NameInput from "@/components/camera/NameInput";
import PhotoPreview from "@/components/camera/PhotoPreview";
import UploadComplete from "@/components/camera/UploadComplete";
import CameraSwitchButton from "@/components/camera/CameraSwitchButton";
import CloseButton from "@/components/camera/CloseButton";
import FullscreenCamera from "./FullscreenCamera";
import { useCameraFlow } from "@/hooks/useCameraFlow";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Props = {
  eventId: string;
  eventToken: string;
};

export default function CameraUpload({
  eventId,
  eventToken,
}: Props) {
  const [guestName, setGuestName] = useState("");
  const [started, setStarted] = useState(false);

  const router = useRouter();

  const flow = useCameraFlow({
    eventId,
    eventToken,
    enabled: started,
  });

  const handleUpload = async () => {
    const success = await flow.actions.upload(guestName);

    if (!success) {
      alert(flow.state.error?.message ?? "送信失敗");
      return;
    }

    router.refresh();
  };

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

  // ===========================
  // 全画面カメラ
  // ===========================
  if (
    started &&
    !flow.state.capturedPhoto &&
    flow.state.status !== "success"
  ) {
    return (
      <FullscreenCamera
        videoRef={flow.refs.videoRef}
        canvasRef={flow.refs.canvasRef}
        onCapture={flow.actions.takePhoto}
        onSwitchCamera={flow.actions.switchCamera}
        onClose={async () => {
          await flow.actions.retakePhoto();
          setStarted(false);
        }}
      />
    );
  }

  return (
    <Card className="shadow-md border-0">
      <CardHeader className="pb-8">
        <CardTitle className="text-2xl">
          📷 写真を撮影
        </CardTitle>

        <CardDescription className="text-base">
          思い出の一枚を撮影してアップロードしましょう
        </CardDescription>
      </CardHeader>

      <CardContent>
        {!started ? (
          <div className="relative z-[9999]">
            <NameInput
              guestName={guestName}
              onGuestNameChange={(value) => {
                console.log("parent update:", value);
                setGuestName(value);
              }}
              onStart={() => setStarted(true)}
            />
          </div>
        ) : flow.state.status === "success" ? (
          <UploadComplete
            onRetake={async () => {
              router.refresh();
              await flow.actions.retakePhoto();
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
        ) : flow.state.capturedPhoto ? (
          <PhotoPreview
            photo={flow.state.capturedPhoto}
            uploading={flow.state.uploading}
            actions={{
              onRetake: flow.actions.retakePhoto,
              onUpload: handleUpload,
            }}
          />
        ) : null}

        <canvas ref={flow.refs.canvasRef} hidden />
      </CardContent>
    </Card>
  );
}
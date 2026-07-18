"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import CameraView from "@/components/camera/CameraView";
import CaptureButton from "@/components/camera/CaptureButton";
import NameInput from "@/components/camera/NameInput";
import PhotoPreview from "@/components/camera/PhotoPreview";
import UploadComplete from "@/components/camera/UploadComplete";
import CameraSwitchButton from "@/components/camera/CameraSwitchButton";
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
    }

    router.refresh();
    await flow.actions.retakePhoto();
  };

  return (
    <Card className="rounded-2xl shadow-md border-0">
      <CardHeader className="pb-8">
        <CardTitle className="text-2xl">📷 写真を撮影</CardTitle>
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
            onViewPhotos={async () => {
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
        ) : !flow.state.capturedPhoto ? (
          <div className="relative">

            <CameraView
              videoRef={flow.refs.videoRef}
            />

            <div className="
              absolute
              bottom-6
              left-0
              right-0
              flex
              justify-center
            ">
              <CaptureButton
                onClick={flow.actions.takePhoto}
              />
            </div>

            <CameraSwitchButton
              onClick={flow.actions.switchCamera}
            />

          </div>
        ) : (
          <PhotoPreview
            photo={flow.state.capturedPhoto}
            uploading={flow.state.uploading}
            actions={{
              onRetake: flow.actions.retakePhoto,
              onUpload: handleUpload,
            }}
          />
        )}

        <canvas ref={flow.refs.canvasRef} hidden />
      </CardContent>
    </Card>
  );
}
"use client";

import CameraView from "@/components/camera/CameraView";
import CaptureButton from "@/components/camera/CaptureButton";
import PhotoPreview from "@/components/camera/PhotoPreview";
import { useCameraFlow } from "@/hooks/useCameraFlow";

type Props = {
  eventId: string;
  eventToken: string;
};

export default function CameraUpload({
  eventId,
  eventToken,
}: Props) {
  const flow = useCameraFlow({
    eventId,
    eventToken,
  });

  return (
    <div>
      {!flow.state.capturedPhoto ? (
        <>
          <CameraView
            videoRef={flow.refs.videoRef}
          />

          <CaptureButton
            onClick={
              flow.actions.takePhoto
            }
          />
        </>
      ) : (
        <PhotoPreview
          photo={
            flow.state.capturedPhoto
          }
          uploading={
            flow.state.uploading
          }
          actions={{
            onRetake:
              flow.actions.retakePhoto,
            onUpload:
              flow.actions.upload,
          }}
        />
      )}

      <canvas
        ref={flow.refs.canvasRef}
        hidden
      />
    </div>
  );
}
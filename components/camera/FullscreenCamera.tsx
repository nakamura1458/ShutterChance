"use client";

import CameraView from "./CameraView";
import CaptureButton from "./CaptureButton";
import CameraSwitchButton from "./CameraSwitchButton";
import CloseButton from "./CloseButton";
import CameraControls from "./CameraControls";

type Props = {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;

  onClose: () => void;
  onCapture: () => void;
  onSwitchCamera: () => void;
};

export default function FullscreenCamera({
  videoRef,
  canvasRef,
  onClose,
  onCapture,
  onSwitchCamera,
}: Props) {
  return (
    <div className="fixed inset-0 z-[100] bg-black">

        <CameraView videoRef={videoRef} />

        <CameraControls
            onClose={onClose}
            onCapture={onCapture}
            onSwitchCamera={onSwitchCamera}
        />

        <canvas ref={canvasRef} hidden />

        </div>
  );
}
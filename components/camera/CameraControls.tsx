"use client";

import CaptureButton from "./CaptureButton";
import CameraSwitchButton from "./CameraSwitchButton";
import CloseButton from "./CloseButton";

type Props = {
  onClose: () => void;
  onCapture: () => void;
  onSwitchCamera: () => void;
};

export default function CameraControls({
  onClose,
  onCapture,
  onSwitchCamera,
}: Props) {
  return (
    <>
      {/* 上部 */}
      <div className="fixed inset-x-0 top-0 z-[120] flex items-center justify-between p-6">
        <CloseButton onClick={onClose} />

        {/* CloseButtonとのバランス用 */}
        <div className="h-11 w-11" />
      </div>

      {/* 下部 */}
      <div
        className="
          fixed
          inset-x-0
          bottom-0
          z-[120]
          pb-[max(env(safe-area-inset-bottom),24px)]
          pt-6
        "
      >
        <div className="relative mx-auto flex w-full max-w-md items-center justify-center">
          <CaptureButton onClick={onCapture} />

          <div className="absolute right-6">
            <CameraSwitchButton onClick={onSwitchCamera} />
          </div>
        </div>
      </div>
    </>
  );
}
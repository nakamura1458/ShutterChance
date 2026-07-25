"use client";

import FullscreenCamera from "./capture/FullscreenCamera";
import FullscreenPreview from "./preview/FullscreenPreview";
import UploadComplete from "./upload/UploadComplete";
import { useCameraFlow } from "@/hooks/useCameraFlow";

type Props = {
    flow: ReturnType<typeof useCameraFlow>;
    onUpload: () => void;
    onClose: () => void;
    onViewPhotos: () => void;
};

export default function CameraScreen({
    flow,
    onUpload,
    onClose,
    onViewPhotos,
}: Props) {
    if (flow.state.status === "success") {
        return (
            <UploadComplete
                onRetake={flow.actions.retakePhoto}
                onViewPhotos={onViewPhotos}
            />
        );
    }

    if (!flow.state.capturedPhoto) {
        return (
            <FullscreenCamera
                videoRef={flow.refs.videoRef}
                canvasRef={flow.refs.canvasRef}
                onCapture={flow.actions.takePhoto}
                onSwitchCamera={flow.actions.switchCamera}
                onClose={onClose}
            />
        );
    }

    return (
        <FullscreenPreview
            photo={flow.state.capturedPhoto}
            uploading={flow.state.uploading}
            onRetake={flow.actions.retakePhoto}
            onUpload={onUpload}
        />
    );
}
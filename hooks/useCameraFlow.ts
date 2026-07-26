"use client";

import { useState } from "react";
import { useCamera } from "./useCamera";
import { useUpload } from "./useUpload";

type Props = {
    eventId: string;
    eventToken: string;
    enabled: boolean;
};

export function useCameraFlow({
    eventId,
    eventToken,
    enabled,
}: Props) {

    const camera = useCamera({
        enabled,
    });

    const upload = useUpload({
        eventId,
        eventToken,
    });

    const [status, setStatus] =
        useState<
        "idle"
        | "uploading"
        | "success"
        | "error"
        >("idle");

    async function handleUpload( guestName = "ゲスト" ) {

        setStatus("uploading");

        const success =
            await upload.actions.upload({
                guestName,
                capturedPhoto:  camera.state.capturedPhoto,
            });

        if (!success) {
            setStatus("error");
            return false;
        }
        setStatus("success");
        return true;
    }

    async function handleRetake(){
        setStatus("idle");
        await camera.actions.retakePhoto();
    }

    const state = {
        ...camera.state,
        uploading:  upload.state.loading,
        error:      upload.state.error,
        status,
    };

    const refs = camera.refs;

    const actions = {
        takePhoto:      camera.actions.takePhoto,
        setPhoto:       camera.actions.setPhoto,
        retakePhoto:    handleRetake,
        upload:         handleUpload,
        switchCamera:   camera.actions.switchCamera,
    };

    return {
        state,
        refs,
        actions,
    };
}
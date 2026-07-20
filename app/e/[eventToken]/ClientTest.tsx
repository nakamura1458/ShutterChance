"use client";

import CameraUpload from "@/components/camera/CameraUpload";

export default function ClientTest() {
  return (
    <>
      <p>Client動作確認</p>
      <CameraUpload
        eventId="test"
        eventToken="test"
      />
    </>
  );
}
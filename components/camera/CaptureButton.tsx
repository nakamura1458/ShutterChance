"use client";

type Props = {
  onClick: () => void;
};

export default function CaptureButton({
  onClick,
}: Props) {
  return (
    <button onClick={onClick}>
      📷 撮影
    </button>
  );
}
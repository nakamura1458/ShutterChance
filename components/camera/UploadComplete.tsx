"use client";

type Props = {
  onRetake: () => void;
  onViewPhotos: () => void;
};

export default function UploadComplete({
  onRetake,
  onViewPhotos,
}: Props) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "32px 16px",
      }}
    >
      <div
        style={{
          fontSize: "64px",
          marginBottom: "16px",
        }}
      >
        ✅
      </div>

      <h2
        style={{
          marginBottom: "8px",
        }}
      >
        アップロード完了！
      </h2>

      <p
        style={{
          color: "#666",
          marginBottom: "32px",
        }}
      >
        写真を共有しました📸
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          maxWidth: "280px",
          margin: "0 auto",
        }}
      >
        <button
          onClick={onRetake}
          style={{
            padding: "12px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          📷 もう1枚撮る
        </button>

        <button
          onClick={onViewPhotos}
          style={{
            padding: "12px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          🖼 写真を見る
        </button>
      </div>
    </div>
  );
}
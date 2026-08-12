export type CompressImageOptions = {
  maxSize?: number;
  quality?: number;
};

const DEFAULT_MAX_SIZE = 2048;
const DEFAULT_QUALITY = 0.88;

export async function compressImage(
  file: File,
  options: CompressImageOptions = {},
): Promise<File> {
  const {
    maxSize = DEFAULT_MAX_SIZE,
    quality = DEFAULT_QUALITY,
  } = options;

  // ----------------------------------------
  // 画像以外はそのまま返す
  // ----------------------------------------

  if (!file.type.startsWith("image/")) {
    return file;
  }

  // ----------------------------------------
  // ImageBitmapで画像を読み込む
  // ----------------------------------------

  const bitmap = await createImageBitmap(file);

  try {
    const { width, height } = bitmap;

    // ----------------------------------------
    // リサイズ後のサイズを計算
    // ----------------------------------------

    const scale = Math.min(
      1,
      maxSize / Math.max(width, height),
    );

    const targetWidth = Math.round(width * scale);
    const targetHeight = Math.round(height * scale);

    // ----------------------------------------
    // Canvasに描画
    // ----------------------------------------

    const canvas = document.createElement("canvas");

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error(
        "画像の圧縮処理に失敗しました。",
      );
    }

    ctx.drawImage(
      bitmap,
      0,
      0,
      targetWidth,
      targetHeight,
    );

    // ----------------------------------------
    // JPEGへ変換
    // ----------------------------------------

    const blob = await new Promise<Blob | null>(
      (resolve) => {
        canvas.toBlob(
          resolve,
          "image/jpeg",
          quality,
        );
      },
    );

    if (!blob) {
      throw new Error(
        "画像の圧縮処理に失敗しました。",
      );
    }

    // ----------------------------------------
    // 圧縮後の方が大きい場合は元画像を使用
    // ----------------------------------------

    if (blob.size >= file.size) {
      return file;
    }

    // ----------------------------------------
    // Fileへ変換
    // ----------------------------------------

    return new File(
      [blob],
      `${file.name.replace(/\.[^/.]+$/, "")}.jpg`,
      {
        type: "image/jpeg",
        lastModified: Date.now(),
      },
    );
  } finally {
    bitmap.close();
  }
}
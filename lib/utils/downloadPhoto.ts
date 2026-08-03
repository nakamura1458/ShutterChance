import type { PhotoListItem } from "@/types/photo";

export async function downloadPhoto(
  photo: PhotoListItem
) {
  try {
    const response = await fetch(photo.image_url);

    const blob = await response.blob();

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = `${photo.guest_name || "photo"}.jpg`;

    a.click();

    URL.revokeObjectURL(url);

  } catch (err) {
    console.error(
      "download failed",
      err
    );
  }
}
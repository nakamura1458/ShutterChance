import type { PhotoListItem } from "@/types/photo";
import { downloadPhoto } from "./downloadPhoto";

export type SavePhotosResult =
  | "shared"
  | "downloaded"
  | "cancelled"
  | "error";

export async function savePhotos(
    photos: PhotoListItem[]
): Promise<SavePhotosResult> {
    try {
        const files = await Promise.all(
        photos.map(async (photo) => {
            const response = await fetch(photo.image_url);
            const blob = await response.blob();

            return new File(
                [blob],
                `${photo.guest_name || "photo"}.jpg`,
                {
                    type: blob.type,
                }
            );
        })
        );

        if (
            navigator.canShare &&
            navigator.canShare({ files })
        ) {
        await navigator.share({
            files,
            title: "写真を保存",
        });

        return "shared";
        }

        // fallback
        for (const photo of photos) {
            await downloadPhoto(photo);
        }

        return "downloaded";

    } catch (err) {
        console.error(err);

        if (
            err instanceof DOMException &&
            err.name === "AbortError"
        ) {
            return "cancelled";
        }

        return "error";
    }
}
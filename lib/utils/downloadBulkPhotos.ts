export type BulkDownloadResult =
  | "downloaded"
  | "error";

export async function downloadBulkPhotos(
  eventToken: string,
  guestNames: string[] = []
): Promise<BulkDownloadResult> {
  try {
    const params = new URLSearchParams();

    for (const guestName of guestNames) {
      params.append("guest", guestName);
    }

    const queryString = params.toString();

    const url =
      `/api/events/${encodeURIComponent(
        eventToken
      )}/photos/download` +
      (queryString
        ? `?${queryString}`
        : "");

    const response = await fetch(url);

    if (!response.ok) {
      let message =
        "写真の一括保存に失敗しました。";

      try {
        const data = await response.json();

        if (data?.error) {
          message = data.error;
        }
      } catch {
        // JSONでない場合はデフォルトメッセージ
      }

      window.alert(message);

      return "error";
    }

    const blob = await response.blob();

    const contentDisposition =
      response.headers.get(
        "Content-Disposition"
      );

    let fileName =
      "ShutterChance_写真.zip";

    const match =
      contentDisposition?.match(
        /filename\*=UTF-8''([^;]+)/i
      );

    if (match?.[1]) {
      fileName = decodeURIComponent(
        match[1]
      );
    }

    const urlObject =
      window.URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = urlObject;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(
      urlObject
    );

    return "downloaded";
  } catch (error) {
    console.error(
      "bulk photo download error:",
      error
    );

    window.alert(
      "写真の一括保存に失敗しました。"
    );

    return "error";
  }
}
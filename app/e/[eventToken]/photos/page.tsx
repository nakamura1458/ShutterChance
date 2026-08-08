import Link from "next/link";

import { getEventByToken } from "@/services/event.service";
import { getPhotos } from "@/services/photo.service";
import PhotoList from "@/components/gallery/PhotoList";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    eventToken: string;
  }>;
};

export default async function PhotosPage({ params }: Props) {
  const { eventToken } = await params;

  const event = await getEventByToken(eventToken);

  if (!event) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-bold">
          イベントが見つかりません
        </h1>
      </main>
    );
  }

  const photos = await getPhotos(event.id);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
        <section className="py-4">
          <Link
            href={`/e/${eventToken}`}
            className="
              mb-4
              inline-block
              text-sm
              font-medium
              text-blue-600
            "
          >
            ← 戻る
          </Link>

          <h1 className="text-2xl font-bold">
            写真一覧
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            {event.name}
          </p>
        </section>

        <PhotoList
          photos={photos}
        />
      </div>
    </main>
  );
}
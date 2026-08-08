import { getEventByToken } from "@/services/event.service";
import { getPhotos } from "@/services/photo.service";
import PhotoPageClient from "@/components/photo/PhotoPageClient";
import Link from "next/link";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    eventToken: string;
  }>;
};

export default async function EventPage({ params }: Props) {
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

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const shareUrl = `${appUrl}/share/${eventToken}`;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
        {/* Header */}
        <section className="py-8 text-center">
          <p className="text-sm text-muted-foreground">
            Photo Sharing
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight">
            {event.name}
          </h1>

          <p className="mt-4 text-muted-foreground">
            思い出をみんなで共有しましょう
          </p>
        </section>

        {/* イベントをシェア */}
        <div className="flex justify-center">
          <Link
            href={shareUrl}
            className="flex items-center justify-center gap-2 rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            📤 このイベントをシェア
          </Link>
        </div>

        <PhotoPageClient
          eventId={event.id}
          eventToken={event.event_token}
          initialPhotos={photos}
        />
      </div>
    </main>
  );
}
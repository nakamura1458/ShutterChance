import { getEventByToken } from "@/services/event.service";
import { getPhotos } from "@/services/photo.service";
import PhotoPageClient from "@/components/photo/PhotoPageClient";
import Link from "next/link";
import { Link as LinkIcon } from "lucide-react";

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

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
        {/* Event Header */}
        <section className="py-12 text-center sm:py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gray-400">
            Shutter Chance
          </p>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            {event.name}
          </h1>
        </section>

        <Link
          href={`/share/${eventToken}`}
          aria-label="イベントを共有"
          className="fixed right-5 top-5 z-40 inline-flex items-center gap-2 rounded-full bg-black px-4 py-3 text-sm font-medium text-white shadow-md transition hover:bg-gray-800 active:scale-95"
        >
          <LinkIcon className="h-4 w-4" />
          <span>共有</span>
        </Link>

        <PhotoPageClient
          eventId={event.id}
          eventToken={event.event_token}
          initialPhotos={photos}
        />
      </div>
    </main>
  );
}
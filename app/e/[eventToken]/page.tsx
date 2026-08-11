import { getEventByToken } from "@/services/event.service";
import { getPhotos } from "@/services/photo.service";
import PhotoPageClient from "@/components/photo/PhotoPageClient";
import Link from "next/link";
import {
  Link as LinkIcon,
  CircleHelp,
} from "lucide-react";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    eventToken: string;
  }>;
};

export default async function EventPage({
  params,
}: Props) {
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

  // ----------------------------------------
  // 写真アップロード上限
  // ----------------------------------------

  const currentPhotoCount = photos.length;

  const isAdminEvent =
    event.user_id ===
    process.env.SHUTTERCHANCE_ADMIN_USER_ID;

  const remainingPhotos = isAdminEvent
    ? null
    : Math.max(
        event.max_upload_count -
          currentPhotoCount,
        0,
      );

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
        {/* Event Header */}
        <section className="pt-10 pb-6 text-center sm:pt-8 sm:pb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gray-400">
            Shutter Chance
          </p>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            {event.name}
          </h1>

          {/* ---------------------------------------- */}
          {/* Upload Limit */}
          {/* ---------------------------------------- */}

          <div className="mt-4">
            {isAdminEvent ? (
              <p className="text-sm text-gray-500">
                写真のアップロード枚数に制限はありません
              </p>
            ) : remainingPhotos === 0 ? (
              <p className="text-sm font-medium text-red-500">
                写真のアップロード上限に達しています
              </p>
            ) : (
              <p className="text-sm text-gray-500">
                あと{" "}
                <span className="font-semibold text-gray-900">
                  {remainingPhotos}枚
                </span>{" "}
                アップロードできます
              </p>
            )}
          </div>
        </section>

        {/* Action Buttons */}
        <div className="fixed right-4 top-2 z-40 flex items-center gap-2">
          {/* Guide */}
          <Link
            href={`/e/${eventToken}/guide`}
            aria-label="ShutterChanceの使い方"
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-medium text-gray-900 shadow-md ring-1 ring-gray-200 transition hover:bg-gray-50 active:scale-95"
          >
            <CircleHelp className="h-4 w-4" />
            <span>使い方</span>
          </Link>

          {/* Share */}
          <Link
            href={`/share/${eventToken}`}
            aria-label="イベントを共有"
            className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-3 text-sm font-medium text-white shadow-md transition hover:bg-gray-800 active:scale-95"
          >
            <LinkIcon className="h-4 w-4" />
            <span>共有</span>
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
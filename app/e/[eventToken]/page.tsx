import { getEventByToken } from "@/services/event.service";
import { getPhotos } from "@/services/photo.service";
import CameraUpload from "@/components/camera/CameraUpload";
import PhotoList from "@/components/camera/PhotoList";
import ClientTest from "./ClientTest";

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
        {/* Header */}
        <section className="py-8 text-center">
          <p className="text-sm text-muted-foreground">
            Wedding Photo Sharing
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight">
            {event.name}
          </h1>

          <p className="mt-4 text-muted-foreground">
            思い出をみんなで共有しましょう
          </p>
        </section>

        {/* Camera */}
        <CameraUpload
          eventId={event.id}
          eventToken={event.event_token}
        />

        {/* Photos */}
        <PhotoList photos={photos} />
      </div>
    </main>
  );
}
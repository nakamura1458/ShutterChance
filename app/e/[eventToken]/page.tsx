import { getEventByToken } from "@/services/event.service";
import { getPhotos } from "@/services/photo.list.service";
import CameraUpload from "./CameraUpload";
import PhotoList from "./PhotoList";


type Props = {
  params: {
    eventToken: string;
  };
};


export default async function EventPage({
  params,
}: Props) {

  const {
    eventToken
  } = await params;


  const event = await getEventByToken(
    eventToken
  );


  if (!event) {
    return (
      <main>

        <h1>
          イベントが見つかりません
        </h1>

      </main>
    );
  }


  const photos = await getPhotos(event.id);

  return (
    <main>
      <h1>{event.name}</h1>

      <CameraUpload
        eventId={event.id}
        eventToken={event.event_token}
      />

      <PhotoList photos={photos} />
    </main>
  );
}
import PhotoCard from "./PhotoCard";
import type { PhotoListItem } from "@/types/photo";


type Props = {
  photos: PhotoListItem[];
};


export default function PhotoList({
  photos,
}: Props) {

  return (
    <section
      id="photo-list"
      className="
        space-y-4
      "
    >

      {/* Header */}

      <div
        className="
          flex
          items-center
          justify-between
          px-1
        "
      >

        <h2
          className="
            text-xl
            font-bold
          "
        >
          📸 Gallery
        </h2>


        <p
          className="
            text-sm
            text-muted-foreground
          "
        >
          {photos.length} Photos
        </p>

      </div>



      {/* Photos */}

      {
        photos.length === 0 ? (

          <p
            className="
              text-muted-foreground
            "
          >
            まだ写真がありません
          </p>

        ) : (

          <div
            className="
              grid
              grid-cols-3
              gap-1
              sm:gap-2
            "
          >

            {
              photos.map((photo) => (

                <PhotoCard
                  key={photo.id}
                  photo={photo}
                />

              ))
            }

          </div>

        )
      }


    </section>
  );
}
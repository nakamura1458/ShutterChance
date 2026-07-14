type Props = {
  photos: {
    id: string;
    image_url: string;
  }[];
};


export default function PhotoList({
  photos,
}: Props) {

  return (
    <section>

      <h2>
        写真一覧
      </h2>


      {
        photos.length === 0 ? (

          <p>
            まだ写真がありません
          </p>

        ) : (

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "8px",
              marginTop: "16px",
            }}
          >

            {
              photos.map((photo) => (

                <img
                  key={photo.id}
                  src={photo.image_url}
                  alt="アップロード写真"
                  style={{
                    width: "100%",
                    aspectRatio: "1 / 1",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />

              ))
            }

          </div>

        )
      }

    </section>
  );
}
import Link from "next/link";

import { getEventByToken } from "@/services/event.service";
import { getPhotosPaginated } from "@/services/photo.service";
import PhotoList from "@/components/gallery/PhotoList";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    eventToken: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
};

const PAGE_SIZE = 60;

export default async function PhotosPage({
  params,
  searchParams,
}: Props) {
  const { eventToken } = await params;
  const { page: pageParam } = await searchParams;

  const page = Math.max(
    1,
    Number(pageParam) || 1
  );

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

  const {
    photos,
    totalCount,
  } = await getPhotosPaginated(
    event.id,
    page,
    PAGE_SIZE
  );

  const totalPages = Math.ceil(
    totalCount / PAGE_SIZE
  );

  const pageNumbers: (number | "ellipsis")[] = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    pageNumbers.push(1);

    if (page > 4) {
      pageNumbers.push("ellipsis");
    }

    const start = Math.max(2, page - 1);
    const end = Math.min(
      totalPages - 1,
      page + 1
    );

    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }

    if (page < totalPages - 3) {
      pageNumbers.push("ellipsis");
    }

    pageNumbers.push(totalPages);
  }

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

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">

            {/* 前へ */}
            {page > 1 ? (
              <Link
                href={`/e/${eventToken}/photos?page=${page - 1}`}
                className="
                  px-3
                  py-2
                  text-sm
                  font-medium
                  text-blue-600
                "
              >
                ← 前へ
              </Link>
            ) : (
              <span
                className="
                  px-3
                  py-2
                  text-sm
                  text-muted-foreground
                "
              >
                ← 前へ
              </span>
            )}

            {/* ページ番号 */}
            {pageNumbers.map((pageNumber, index) => {
              if (pageNumber === "ellipsis") {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      text-sm
                      text-muted-foreground
                    "
                  >
                    …
                  </span>
                );
              }

              return (
                <Link
                  key={pageNumber}
                  href={`/e/${eventToken}/photos?page=${pageNumber}`}
                  className={`
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    text-sm
                    font-medium
                    ${
                      pageNumber === page
                        ? "bg-blue-600 text-white"
                        : "text-blue-600 hover:bg-blue-50"
                    }
                  `}
                >
                  {pageNumber}
                </Link>
              );
            })}

            {/* 次へ */}
            {page < totalPages ? (
              <Link
                href={`/e/${eventToken}/photos?page=${page + 1}`}
                className="
                  px-3
                  py-2
                  text-sm
                  font-medium
                  text-blue-600
                "
              >
                次へ →
              </Link>
            ) : (
              <span
                className="
                  px-3
                  py-2
                  text-sm
                  text-muted-foreground
                "
              >
                次へ →
              </span>
            )}

          </div>
        )}

      </div>
    </main>
  );
}
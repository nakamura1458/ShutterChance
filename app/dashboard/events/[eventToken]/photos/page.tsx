import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Images } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { getMyEventByToken } from "@/services/event.service";
import {
  getPhotosPaginated,
  getGuestPhotoCounts,
} from "@/services/photo.service";
import PhotoList from "@/components/gallery/PhotoList";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    eventToken: string;
  }>;
  searchParams: Promise<{
    page?: string;
    sort?: string;
    guest?: string | string[];
  }>;
};

const PAGE_SIZE = 60;

export default async function EventPhotosPage({
  params,
  searchParams,
}: Props) {
  const { eventToken } = await params;

  const {
    page: pageParam,
    sort: sortParam,
    guest: guestParam,
  } = await searchParams;

  // ----------------------------------------
  // ログイン確認
  // ----------------------------------------

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // ----------------------------------------
  // 自分が所有するイベントを取得
  // ----------------------------------------

  const event = await getMyEventByToken(eventToken);

  if (!event) {
    notFound();
  }

  // ----------------------------------------
  // ページ・ソート・ゲストフィルター
  // ----------------------------------------

  const page = Math.max(
    1,
    Number(pageParam) || 1
  );

  const sort =
    sortParam === "oldest" || sortParam === "likes"
      ? sortParam
      : "newest";

  const guestNames =
    guestParam === undefined
      ? []
      : Array.isArray(guestParam)
        ? guestParam
        : [guestParam];

  // ----------------------------------------
  // 写真取得
  // ----------------------------------------

  const { photos, totalCount } =
    await getPhotosPaginated(
      event.id,
      page,
      PAGE_SIZE,
      sort,
      guestNames
    );

  // ----------------------------------------
  // ゲストごとの写真枚数
  // ----------------------------------------

  const guestPhotoCounts =
    await getGuestPhotoCounts(event.id);

  const totalPages = Math.ceil(
    totalCount / PAGE_SIZE
  );

  // ----------------------------------------
  // ページURL生成
  // ----------------------------------------

  const createPageUrl = (targetPage: number) => {
    const params = new URLSearchParams();

    params.set("page", String(targetPage));

    if (sort !== "newest") {
      params.set("sort", sort);
    }

    guestNames.forEach((guestName) => {
      params.append("guest", guestName);
    });

    return `/dashboard/events/${eventToken}/photos?${params.toString()}`;
  };

  // ----------------------------------------
  // ページ番号
  // ----------------------------------------

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
      {/* ---------------------------------------- */}
      {/* ヘッダー */}
      {/* ---------------------------------------- */}

      <header className="sticky top-0 z-20 border-b border-gray-200/80 bg-gray-50/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center px-6">
          <Link
            href={`/dashboard/events/${eventToken}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            イベント管理に戻る
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* ---------------------------------------- */}
        {/* ページタイトル */}
        {/* ---------------------------------------- */}

        <section>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
              <Images className="h-5 w-5 text-gray-700" />
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">
                写真管理
              </p>

              <h1 className="mt-0.5 text-2xl font-semibold tracking-tight text-gray-900">
                {event.name}
              </h1>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
            <div>
              <p className="text-sm text-gray-500">
                アップロードされた写真
              </p>

              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {totalCount.toLocaleString()}
                <span className="ml-1 text-sm font-normal text-gray-500">
                  枚
                </span>
              </p>
            </div>

            <Link
              href={`/e/${eventToken}/photos`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 sm:inline-flex"
            >
              公開ページを見る
            </Link>
          </div>
        </section>

        {/* ---------------------------------------- */}
        {/* 写真一覧 */}
        {/* ---------------------------------------- */}

        <section className="mt-8">
          {totalCount === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                <Images className="h-6 w-6 text-gray-400" />
              </div>

              <h2 className="mt-5 text-base font-semibold text-gray-900">
                まだ写真がありません
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                ゲストが写真をアップロードすると、
                <br />
                ここに表示されます。
              </p>
            </div>
          ) : (
            <PhotoList
              photos={photos}
              showFilter
              eventToken={eventToken}
              guestPhotoCounts={guestPhotoCounts}
              totalPhotoCount={totalCount}
              organizerMode
            />
          )}
        </section>

        {/* ---------------------------------------- */}
        {/* ページネーション */}
        {/* ---------------------------------------- */}

        {totalPages > 1 && (
          <nav
            aria-label="写真ページ"
            className="mt-10 flex items-center justify-center gap-1.5"
          >
            {/* 前へ */}

            {page > 1 ? (
              <Link
                href={createPageUrl(page - 1)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-white hover:text-gray-900"
              >
                ← 前へ
              </Link>
            ) : (
              <span className="px-3 py-2 text-sm text-gray-300">
                ← 前へ
              </span>
            )}

            {/* ページ番号 */}

            {pageNumbers.map((pageNumber, index) => {
              if (pageNumber === "ellipsis") {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="flex h-9 w-9 items-center justify-center text-sm text-gray-400"
                  >
                    …
                  </span>
                );
              }

              const isCurrent =
                pageNumber === page;

              return (
                <Link
                  key={pageNumber}
                  href={createPageUrl(pageNumber)}
                  aria-current={
                    isCurrent
                      ? "page"
                      : undefined
                  }
                  className={`
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-lg
                    text-sm
                    font-medium
                    transition
                    ${
                      isCurrent
                        ? "bg-black text-white"
                        : "text-gray-600 hover:bg-white hover:text-gray-900"
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
                href={createPageUrl(page + 1)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-white hover:text-gray-900"
              >
                次へ →
              </Link>
            ) : (
              <span className="px-3 py-2 text-sm text-gray-300">
                次へ →
              </span>
            )}
          </nav>
        )}
      </div>
    </main>
  );
}
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getMyEventByToken } from "@/services/event.service";
import EventSettings from "@/components/event/EventSettings";

type Props = {
  params: Promise<{
    eventToken: string;
  }>;
};

export default async function EventDashboardPage({
  params,
}: Props) {
  const { eventToken } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const event = await getMyEventByToken(eventToken);

  if (!event) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <Link
          href="/dashboard"
          className="text-sm text-gray-500 transition hover:text-black"
        >
          ← ダッシュボードに戻る
        </Link>

        <header className="mt-8">
          <p className="text-sm text-gray-500">
            イベント管理
          </p>

          <h1 className="mt-1 text-3xl font-semibold">
            {event.name}
          </h1>
        </header>

        <section className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">
              イベントURL
            </p>

            <p className="mt-3 break-all text-sm font-medium">
              /e/{event.event_token}
            </p>

            <Link
              href={`/e/${event.event_token}`}
              target="_blank"
              className="mt-5 inline-block rounded-xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              イベントページを見る
            </Link>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">
              イベント設定
            </p>

            <p className="mt-3 text-sm text-gray-600">
              イベント名やアップロード設定などを管理できます。
            </p>

            <button
              type="button"
              className="mt-5 rounded-xl border border-gray-300 px-5 py-3 text-sm font-medium transition hover:bg-gray-50"
            >
              設定を編集
            </button>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold">
            写真
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            このイベントにアップロードされた写真を管理します。
          </p>

          <Link
            href={`/e/${event.event_token}/photos`}
            target="_blank"
            className="mt-5 inline-block rounded-xl border border-gray-300 px-5 py-3 text-sm font-medium transition hover:bg-gray-50"
          >
            写真一覧を見る
          </Link>
        </section>

        <EventSettings event={event} />
      </div>
    </main>
  );
}
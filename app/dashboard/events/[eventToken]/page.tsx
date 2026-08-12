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

  // プラン情報を取得
  const {data: plan, error: planError} = await supabase
    .from("event_plans")
    .select(
      "id, name, price, max_upload_count, retention_days",
    )
    .eq("id", event.plan)
    .single();

  if (planError || !plan) {
    console.error("event plan fetch error", planError);
    notFound();
  }

  const {count: photoCount, error: photoCountError} = await supabase
    .from("photos")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("event_id", event.id);

  if (photoCountError) {
    console.error(
      "photo count fetch error",
      photoCountError,
    );
  }

  const currentPhotoCount = photoCount ?? 0;

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

        {/* ---------------------------------------- */}
        {/* イベント情報 */}
        {/* ---------------------------------------- */}

        <section className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold">
              イベントURL
            </h2>

            <p className="mt-3 break-all text-sm font-medium">
              イベントトップページに遷移します
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
            <h2 className="text-lg font-semibold">
              写真
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              このイベントにアップロードされた写真を管理します。
            </p>

            <Link
              href={`/e/${event.event_token}/photos`}
              target="_blank"
              className="mt-5 inline-block rounded-xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              写真一覧を見る
            </Link>
          </div>
        </section>

        <EventSettings
          event={event}
          plan={plan}
          currentPhotoCount={currentPhotoCount}
        />
      </div>
    </main>
  );
}
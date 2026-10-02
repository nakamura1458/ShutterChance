import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getMyEventByToken } from "@/services/event.service";
import EventSettings from "@/components/event/EventSettings";
import EventDeleteButton from "@/components/event/EventDeleteButton";

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

  // ----------------------------------------
  // プラン情報を取得
  // ----------------------------------------

  const { data: plan, error: planError } = await supabase
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

  // ----------------------------------------
  // 写真枚数を取得
  // ----------------------------------------

  const { count: photoCount, error: photoCountError } =
    await supabase
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
        {/* ---------------------------------------- */}
        {/* 戻る */}
        {/* ---------------------------------------- */}

        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-gray-500 transition hover:text-gray-900"
        >
          ← ダッシュボードに戻る
        </Link>

        {/* ---------------------------------------- */}
        {/* ヘッダー */}
        {/* ---------------------------------------- */}

        <header className="mt-8">
          <p className="text-sm font-medium text-gray-500">
            イベント管理
          </p>

          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            {event.name}
          </h1>
        </header>

        {/* ---------------------------------------- */}
        {/* イベント情報 */}
        {/* ---------------------------------------- */}

        <section className="mt-8 grid gap-5 sm:grid-cols-2">
          {/* イベントページ */}

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100">
                    <span className="text-lg">🔗</span>
                  </div>

                  <h2 className="text-lg font-semibold text-gray-900">
                    イベントページ
                  </h2>
                </div>

                <p className="mt-4 text-sm leading-6 text-gray-500">
                  ゲストがアクセスするイベントページを確認できます。
                </p>
              </div>
            </div>

            <Link
              href={`/e/${event.event_token}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              イベントページを見る
            </Link>
          </div>

          {/* 写真管理 */}

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100">
                    <span className="text-lg">📷</span>
                  </div>

                  <h2 className="text-lg font-semibold text-gray-900">
                    写真管理
                  </h2>
                </div>

                <p className="mt-4 text-sm leading-6 text-gray-500">
                  ゲストからアップロードされた写真を確認・管理できます。
                </p>
              </div>
            </div>

            {/* 写真枚数 */}

            <div className="mt-5 flex items-end justify-between rounded-xl bg-gray-50 px-4 py-3">
              <div>
                <p className="text-xs font-medium text-gray-500">
                  アップロード済み
                </p>

                <p className="mt-1 text-xl font-semibold text-gray-900">
                  {currentPhotoCount}
                  <span className="ml-1 text-sm font-normal text-gray-500">
                    枚
                  </span>
                </p>
              </div>

              <p className="text-xs text-gray-400">
                最大 {plan.max_upload_count.toLocaleString()} 枚
              </p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <Link
                href={`/e/${event.event_token}/photos`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                写真を見る
              </Link>

              <Link
                href={`/dashboard/events/${event.event_token}/photos`}
                className="inline-flex items-center justify-center rounded-xl bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                写真を管理
              </Link>
            </div>
          </div>
        </section>

        {/* ---------------------------------------- */}
        {/* イベント設定 */}
        {/* ---------------------------------------- */}

        <EventSettings
          event={event}
          plan={plan}
          currentPhotoCount={currentPhotoCount}
        />

        {/* ---------------------------------------- */}
        {/* 危険な操作 */}
        {/* ---------------------------------------- */}

        <div className="mt-10 border-t border-gray-200 pt-8">
          <h2 className="text-lg font-semibold text-gray-900">
            危険な操作
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            イベントを削除すると、イベント情報とアップロードされた写真がすべて削除されます。
            <br />
            ⚠️ この操作は復元できません。
          </p>

          <div className="mt-4">
            <EventDeleteButton
              eventToken={event.event_token}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
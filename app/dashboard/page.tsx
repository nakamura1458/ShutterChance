import { redirect } from "next/navigation";
import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import { getMyEvents } from "@/services/event.service";
import EventDeleteButton from "@/components/event/EventDeleteButton";
import BackToHomeButton from "@/components/common/BackToHomeButton";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const events = await getMyEvents();

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
        {/* =========================
            Header
        ========================= */}
        <header className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between sm:gap-0">
          <div>
            {/* トップ画面へ戻る */}
            <BackToHomeButton />

            <div className="mt-5">
              <h1 className="text-2xl font-semibold uppercase tracking-[0.2em] sm:text-3xl sm:tracking-[0.25em]">
                Shutter Chance
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                主催者ダッシュボード
              </p>
            </div>
          </div>

          {/* Logout */}
          <form
            action={async () => {
              "use server";

              const supabase = await createClient();

              await supabase.auth.signOut();

              redirect("/login");
            }}
            className="sm:pt-1"
          >
            <button
              type="submit"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium transition hover:bg-gray-100 sm:w-auto"
            >
              ログアウト
            </button>
          </form>
        </header>

        {/* =========================
            Events
        ========================= */}
        <section className="mt-10 sm:mt-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
            <div>
              <h2 className="text-xl font-semibold">あなたのイベント</h2>

              <p className="mt-1 text-sm text-gray-500">
                イベントを作成して写真を集めましょう。
              </p>
            </div>

            <Link
              href="/dashboard/events/new"
              className="inline-flex w-full items-center justify-center rounded-xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800 sm:w-auto"
            >
              ＋ イベントを作成
            </Link>
          </div>

          {/* =========================
              Empty
          ========================= */}
          {events.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-gray-300 bg-white px-4 py-12 text-center sm:mt-8 sm:px-6 sm:py-16">
              <p className="text-gray-500">まだイベントがありません。</p>

              <Link
                href="/dashboard/events/new"
                className="mt-4 inline-flex rounded-xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                最初のイベントを作成
              </Link>
            </div>
          ) : (
            /* =========================
                Event List
            ========================= */
            <div className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6"
                >
                  <h3 className="text-lg font-semibold">
                    {event.name}
                  </h3>

                  <p className="mt-2 break-all text-sm text-gray-500">
                    /e/{event.event_token}
                  </p>

                  <div className="mt-5 flex flex-col gap-3 sm:mt-6 sm:flex-row sm:flex-wrap">
                    <Link
                      href={`/dashboard/events/${event.event_token}`}
                      className="inline-flex w-full items-center justify-center rounded-lg bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800 sm:w-auto"
                    >
                      イベントを管理
                    </Link>

                    <EventDeleteButton
                      eventToken={event.event_token}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
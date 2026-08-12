import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getMyEvents } from "@/services/event.service";
import EventDeleteButton from "@/components/event/EventDeleteButton";

import Link from "next/link";

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
      <div className="mx-auto max-w-5xl px-6 py-10">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold uppercase tracking-[0.25em]">
              Shutter Chance
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              主催者ダッシュボード
            </p>
          </div>

          <form
            action={async () => {
              "use server";

              const supabase = await createClient();

              await supabase.auth.signOut();

              redirect("/login");
            }}
          >
            <button
              type="submit"
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium transition hover:bg-gray-100"
            >
              ログアウト
            </button>
          </form>
        </header>

        <section className="mt-12">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                あなたのイベント
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                イベントを作成して写真を集めましょう。
              </p>
            </div>

            <Link
              href="/dashboard/events/new"
              className="rounded-xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              ＋ イベントを作成
            </Link>
          </div>

          {events.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
              <p className="text-gray-500">
                まだイベントがありません。
              </p>

              <Link
                href="/dashboard/events/new"
                className="mt-4 inline-block rounded-xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                最初のイベントを作成
              </Link>
            </div>
          ) : (
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="rounded-2xl border border-gray-200 bg-white p-6"
                >
                  <h3 className="text-lg font-semibold">
                    {event.name}
                  </h3>

                  <p className="mt-2 break-all text-sm text-gray-500">
                    /e/{event.event_token}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      href={`/dashboard/events/${event.event_token}`}
                      className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
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
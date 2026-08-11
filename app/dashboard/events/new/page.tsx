"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";
import PlanSelector from "@/components/dashboard/PlanSelector";

import {
  createEvent,
  getEventPlans,
} from "@/actions/event.actions";

const MAX_EVENT_DURATION_DAYS = 14;

function getMaxDate(startDate: string) {
  if (!startDate) {
    return "";
  }

  const date = new Date(
    `${startDate}T00:00:00`,
  );

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  date.setDate(
    date.getDate() + MAX_EVENT_DURATION_DAYS,
  );

  const year = date.getFullYear();
  const month = String(
    date.getMonth() + 1,
  ).padStart(2, "0");
  const day = String(
    date.getDate(),
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getMinDate() {
  const now = new Date();

  const offset = now.getTimezoneOffset();

  const localDate = new Date(
    now.getTime() - offset * 60 * 1000,
  );

  return localDate.toISOString().slice(0, 10);
}

export default function NewEventPage() {
  const router = useRouter();

  const [plan, setPlan] = useState("free");

  const [plans, setPlans] = useState<
    Awaited<ReturnType<typeof getEventPlans>>
  >([]);


  // ----------------------------------------
  // 基本情報
  // ----------------------------------------
  const [name, setName] = useState("");

  // ----------------------------------------
  // イベント開始日
  // ----------------------------------------
  const [eventStartDate, setEventStartDate] = useState("");

  // ----------------------------------------
  // イベント終了日
  // ----------------------------------------
  const [hasEventDeadline, setHasEventDeadline] = useState(false);

  const [eventDeadline, setEventDeadline] = useState("");

  // ----------------------------------------
  // 状態
  // ----------------------------------------

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreateEvent(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    // ----------------------------------------
    // 基本バリデーション
    // ----------------------------------------
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("イベント名を入力してください。");
      setLoading(false);
      return;
    }

    if (!plan) {
      setError("料金プランを選択してください。");
      setLoading(false);
      return;
    }

    // ----------------------------------------
    // 期限バリデーション
    // ----------------------------------------
    if (hasEventDeadline && !eventDeadline) {
      setError(
        "イベント終了日を設定してください。",
      );
      setLoading(false);
      return;
    }

    if (!eventStartDate) {
      setError(
        "イベント開始日を設定してください。",
      );
      setLoading(false);
      return;
    }

    // ----------------------------------------
    // 日時チェック
    // ----------------------------------------
    if (
      hasEventDeadline &&
      eventDeadline &&
      eventDeadline < eventStartDate
    ) {
      setError(
        "イベント終了日は開始日以降の日付を設定してください。",
      );
      setLoading(false);
      return;
    }

    if (
      hasEventDeadline &&
      eventDeadline &&
      maxEventDate &&
      eventDeadline > maxEventDate
    ) {
      setError(
        `イベント期間は最大${MAX_EVENT_DURATION_DAYS}日間です。`,
      );
      setLoading(false);
      return;
    }

    // ----------------------------------------
    // イベント作成
    // ----------------------------------------
    try {
      await createEvent({
        name: trimmedName,
        plan,
        eventStartAt: eventStartDate,
        eventDeadline:
          hasEventDeadline && eventDeadline
            ? eventDeadline
            : null,
      });

      // ----------------------------------------
      // ダッシュボードへ
      // ----------------------------------------

      router.push("/dashboard");
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "イベントの作成に失敗しました。",
      );

      setLoading(false);
    }
  }

  const minDate = getMinDate();
  
  const maxEventDate = getMaxDate(eventStartDate);

  useEffect(() => {
    async function loadPlans() {
      try {
        const data = await getEventPlans();
        setPlans(data);
        if (data.length > 0) {
          setPlan(data[0].id);
        }
      } catch (error) {
        console.error(error);

        setError(
          error instanceof Error
            ? error.message
            : "イベントプランの取得に失敗しました。",
        );
      }
    }

    loadPlans();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl px-6 py-10">
        {/* 戻る */}
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="text-sm text-gray-500 transition hover:text-black"
        >
          ← ダッシュボードに戻る
        </button>

        <div className="mt-8 rounded-2xl bg-white p-8 shadow-sm">
          {/* ---------------------------------------- */}
          {/* Header */}
          {/* ---------------------------------------- */}

          <h1 className="text-2xl font-semibold">
            イベントを作成
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            写真を集めるイベントを作成します。
          </p>

          <form
            onSubmit={handleCreateEvent}
            className="mt-8 space-y-6"
          >
            {/* ---------------------------------------- */}
            {/* イベント名 */}
            {/* ---------------------------------------- */}

            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-gray-900"
              >
                イベント名
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="例：結婚式"
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
              />
            </div>

            {/* ---------------------------------------- */}
            {/* 料金プラン */}
            {/* ---------------------------------------- */}
            <PlanSelector
              plans={plans}
              selectedPlan={plan}
              onSelect={setPlan}
            />

            {/* ---------------------------------------- */}
            {/* イベント開始日 */}
            {/* ---------------------------------------- */}
            <div>
              <label
                htmlFor="event-start-at"
                className="mb-2 block text-sm font-medium text-gray-900"
              >
                イベント開始日
              </label>

              <input
                id="event-start-at"
                type="date"
                min={minDate}
                value={eventStartDate}
                onChange={(event) =>
                  setEventStartDate(event.target.value)
                }
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
              />

              <p className="mt-2 text-xs text-gray-400">
                イベントが開催される日時を設定してください。
              </p>
            </div>

            {/* ---------------------------------------- */}
            {/* イベント終了日 */}
            {/* ---------------------------------------- */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900">
                イベント終了日
              </label>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setHasEventDeadline(true);

                    if (!eventDeadline) {
                      setEventDeadline(
                        minDate,
                      );
                    }
                  }}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                    hasEventDeadline
                      ? "bg-black text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  日付を設定
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setHasEventDeadline(false);
                    setEventDeadline("");
                  }}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                    !hasEventDeadline
                      ? "bg-black text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  設定しない
                </button>
              </div>

              {hasEventDeadline && (
                <input
                  id="event-deadline"
                  type="date"
                  min={eventStartDate || minDate}
                  max={maxEventDate || undefined}
                  value={eventDeadline}
                  onChange={(event) =>
                    setEventDeadline(event.target.value)
                  }
                  className="mt-3 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
                />
              )}

              <p className="mt-2 text-xs text-gray-400">
                未設定の場合はイベント終了日の制限はありません。
              </p>
            </div>

            {/* ---------------------------------------- */}
            {/* エラー */}
            {/* ---------------------------------------- */}

            {error && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </p>
            )}

            {/* ---------------------------------------- */}
            {/* 作成ボタン */}
            {/* ---------------------------------------- */}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-black px-4 py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "作成中..."
                : "イベントを作成"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
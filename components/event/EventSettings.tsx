"use client";

import { useState } from "react";

import { updateEventSettings } from "@/actions/event.actions";

const MAX_EVENT_DURATION_DAYS = 14;

// ----------------------------------------
// DBの日時 → JSTの YYYY-MM-DD
// ----------------------------------------
function toDateString(value: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(date)
    .replace(/\//g, "-");
}

// ----------------------------------------
// JSTの今日 → YYYY-MM-DD
// ----------------------------------------
function getTodayDate() {
  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(new Date())
    .replace(/\//g, "-");
}

// ----------------------------------------
// YYYY-MM-DD → JSTのDate
// ----------------------------------------
function dateStringToJSTDate(
  dateString: string,
) {
  return new Date(
    `${dateString}T00:00:00+09:00`,
  );
}

// ----------------------------------------
// 開始日 + 14日
// ----------------------------------------
function getMaxDate(startDateString: string) {
  if (!startDateString) {
    return "";
  }

  const date = dateStringToJSTDate(
    startDateString,
  );

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  // JSTの日付として14日追加する
  const jstDate = new Intl.DateTimeFormat(
    "ja-JP",
    {
      timeZone: "Asia/Tokyo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    },
  )
    .formatToParts(date)
    .reduce<Record<string, string>>(
      (result, part) => {
        if (part.type !== "literal") {
          result[part.type] = part.value;
        }

        return result;
      },
      {},
    );

  const year = Number(jstDate.year);
  const month = Number(jstDate.month);
  const day = Number(jstDate.day);

  const result = new Date(
    year,
    month - 1,
    day,
  );

  result.setDate(
    result.getDate() +
      MAX_EVENT_DURATION_DAYS,
  );

  return [
    result.getFullYear(),
    String(result.getMonth() + 1).padStart(2, "0"),
    String(result.getDate()).padStart(2, "0"),
  ].join("-");
}

// ----------------------------------------
// 保存期限までの残り日数
// ----------------------------------------
function getRemainingRetentionDays(eventDeadline: string | null, retentionDays: number) {
  if (!eventDeadline) {
    return null;
  }

  const deadlineDate = toDateString(eventDeadline);

  if (!deadlineDate) {
    return null;
  }

  const [year, month, day] = deadlineDate.split("-").map(Number);

  const deleteDate = new Date(year, month - 1, day);

  deleteDate.setDate(deleteDate.getDate() + retentionDays);

  const todayString = getTodayDate();

  const [todayYear, todayMonth, todayDay] = todayString.split("-").map(Number);

  const todayDate = new Date(todayYear, todayMonth - 1, todayDay);

  const diff = deleteDate.getTime() - todayDate.getTime();

  return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24),), 0);
}


// ----------------------------------------
// Props
// ----------------------------------------
type Props = {
  event: {
    id: string;
    name: string;
    max_upload_count: number;
    event_start_at: string | null;
    event_deadline: string | null;
    is_public: boolean;
    allow_guest_download: boolean;
  };

  plan: {
    id: string;
    name: string;
    price: number;
    max_upload_count: number;
    retention_days: number;
  };
  currentPhotoCount: number;
};

export default function EventSettings({
  event,
  plan,
  currentPhotoCount,
}: Props) {
  // イベント名
  const [name, setName] = useState(event.name);

  //　プラン情報 
  const remainingPhotoCount = Math.max(plan.max_upload_count - currentPhotoCount, 0);

  const remainingRetentionDays = getRemainingRetentionDays(event.event_deadline, plan.retention_days);

  // イベント開始日
  const [eventStartAt, setEventStartAt] = useState(toDateString(event.event_start_at));

  // イベント終了日
  const [eventDeadline, setEventDeadline] = useState(toDateString(event.event_deadline));

  // const [eventDeadline, setEventDeadline] = useState(toDateString(event.event_deadline));

  // 公開状態
  const [isPublic, setIsPublic] = useState(event.is_public);

  // ゲストダウンロード
  const [allowGuestDownload, setAllowGuestDownload] = useState(event.allow_guest_download);

  // 保存状態
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  // 日付制限
  const minDate = getTodayDate();

  const maxEventDate = getMaxDate(eventStartAt);

  // 保存
  async function handleSave() {
    setSaving(true);
    setMessage("");
    setError("");

    // イベント名
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError(
        "イベント名を入力してください。",
      );
      setSaving(false);
      return;
    }

    // 保存
    try {
      await updateEventSettings({
        eventId: event.id,
        name: trimmedName,
        eventDeadline: eventDeadline || null,
        isPublic,
        allowGuestDownload,
      });

      setMessage(
        "設定を保存しました。",
      );
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "設定の保存に失敗しました。",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6">
      {/* ---------------------------------------- */}
      {/* Header */}
      {/* ---------------------------------------- */}

      <h2 className="text-lg font-semibold">
        イベント詳細設定
      </h2>

      <p className="mt-2 text-sm text-gray-500">
        イベントの基本情報や写真の公開設定を変更できます。
      </p>

      <div className="mt-8 space-y-6">
        {/* ---------------------------------------- */}
        {/* イベント名 */}
        {/* ---------------------------------------- */}

        <div>
          <label
            htmlFor="event-name"
            className="mb-2 block text-sm font-medium text-gray-900"
          >
            イベント名
          </label>

          <input
            id="event-name"
            type="text"
            value={name}
            onChange={(event) =>
              setName(
                event.target.value,
              )
            }
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
          />
        </div>

        {/* ---------------------------------------- */}
        {/* 料金プラン */}
        {/* ---------------------------------------- */}

        <div>
          <label className="mb-3 block text-sm font-medium text-gray-900">
            料金プラン
          </label>

          <div className="w-full rounded-xl border border-black bg-gray-50 text-left">
            {/* ---------------------------------------- */}
            {/* プラン概要 */}
            {/* ---------------------------------------- */}

            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* 選択状態 */}
                  <span className="text-xl leading-none text-black">
                    ●
                  </span>

                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">
                        {plan.name}
                      </p>

                      {plan.id === "standard" && (
                        <span className="rounded-full bg-black px-2 py-0.5 text-[10px] font-medium text-white">
                          おすすめ
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-sm text-gray-500">
                      {plan.max_upload_count.toLocaleString()}
                      枚まで
                    </p>
                  </div>
                </div>

                <p className="font-semibold">
                  {plan.price === 0
                    ? "0円"
                    : `${plan.price.toLocaleString()}円`}
                </p>
              </div>
            </div>

            {/* ---------------------------------------- */}
            {/* プラン詳細 */}
            {/* ---------------------------------------- */}

            <div className="border-t border-gray-200 px-4 py-4">
              <p className="mb-3 text-sm font-medium text-gray-900">
                プラン詳細
              </p>

              <div className="space-y-3 text-sm">
                {/* アップロード枚数 */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">
                    アップロード枚数
                  </span>

                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {plan.max_upload_count.toLocaleString()}
                      枚まで
                    </p>

                    <p className="mt-0.5 text-xs text-gray-400">
                      現在 {currentPhotoCount.toLocaleString()} 枚
                      {" / "}
                      あと {remainingPhotoCount.toLocaleString()} 枚
                    </p>
                  </div>
                </div>

                {/* 保存期間 */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">
                    保存期間
                  </span>

                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      イベント終了後{" "}
                      {plan.retention_days}
                      日間
                    </p>

                    {remainingRetentionDays !== null ? (
                      <p className="mt-0.5 text-xs text-gray-400">
                        写真削除まで あと{" "}
                        {remainingRetentionDays}
                        日
                      </p>
                    ) : (
                      <p className="mt-0.5 text-xs text-gray-400">
                        イベント終了日未設定
                      </p>
                    )}
                  </div>
                </div>

                {/* 料金 */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">
                    料金
                  </span>

                  <span className="font-medium text-gray-900">
                    {plan.price === 0
                      ? "無料"
                      : `${plan.price.toLocaleString()} 円`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-2 text-xs text-gray-400">
            料金プランはイベント作成後に変更できません。
          </p>
        </div>

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
            value={eventStartAt}
            readOnly
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500 outline-none"
          />

          <p className="mt-2 text-xs text-gray-400">
            イベント開始日はイベント作成後に変更できません。
          </p>
        </div>

        {/* ---------------------------------------- */}
        {/* イベント終了日 */}
        {/* ---------------------------------------- */}

        <div>
  <label
    htmlFor="event-deadline"
    className="mb-2 block text-sm font-medium text-gray-900"
  >
    イベント終了日
  </label>

  <input
    id="event-deadline"
    type="date"
    min={eventStartAt || minDate}
    max={maxEventDate || undefined}
    value={eventDeadline}
    onChange={(e) => {
      setEventDeadline(e.target.value);
    }}
    required
    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
  />

  <p className="mt-2 text-xs text-gray-400">
    イベント期間は最大
    {MAX_EVENT_DURATION_DAYS}
    日間です。
  </p>
</div>

        {/* ---------------------------------------- */}
        {/* イベント公開 */}
        {/* ---------------------------------------- */}

        <div className="flex items-center justify-between rounded-xl border border-gray-200 p-4">
          <div>
            <p className="text-sm font-medium">
              イベントを公開
            </p>

            <p className="mt-1 text-xs text-gray-400">
              ゲストがイベントページを利用できるようにします。
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setIsPublic(!isPublic)
            }
            className={`relative h-7 w-12 rounded-full transition ${
              isPublic
                ? "bg-black"
                : "bg-gray-300"
            }`}
            aria-label="イベント公開設定"
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${
                isPublic
                  ? "left-6"
                  : "left-1"
              }`}
            />
          </button>
        </div>

        {/* ---------------------------------------- */}
        {/* ゲストダウンロード */}
        {/* ---------------------------------------- */}

        <div className="flex items-center justify-between rounded-xl border border-gray-200 p-4">
          <div>
            <p className="text-sm font-medium">
              ゲストの写真ダウンロード
            </p>

            <p className="mt-1 text-xs text-gray-400">
              ゲストが写真を保存できるようにします。
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setAllowGuestDownload(
                !allowGuestDownload,
              )
            }
            className={`relative h-7 w-12 rounded-full transition ${
              allowGuestDownload
                ? "bg-black"
                : "bg-gray-300"
            }`}
            aria-label="ゲストダウンロード設定"
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${
                allowGuestDownload
                  ? "left-6"
                  : "left-1"
              }`}
            />
          </button>
        </div>

        {/* ---------------------------------------- */}
        {/* メッセージ */}
        {/* ---------------------------------------- */}

        {message && (
          <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </p>
        )}

        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        )}

        {/* ---------------------------------------- */}
        {/* 保存 */}
        {/* ---------------------------------------- */}

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="w-full rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving
            ? "保存中..."
            : "変更を保存"}
        </button>
      </div>
    </section>
  );
}
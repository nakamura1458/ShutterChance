"use client";

import { useState } from "react";

import { updateEventSettings } from "@/actions/event.actions";
import { EVENT_PLANS } from "@/lib/event-plan";

type Props = {
  event: {
    id: string;
    name: string;
    plan: "free" | "standard" | "plus";
    max_upload_count: number;
    event_start_at: string | null;
    event_deadline: string | null;
    is_public: boolean;
    allow_guest_download: boolean;
  };
};

const MAX_EVENT_DURATION_DAYS = 14;

function toDateLocal(value: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offset = date.getTimezoneOffset();

  const localDate = new Date(
    date.getTime() - offset * 60 * 1000,
  );

  return localDate.toISOString().slice(0, 10);
}

function getMinDate() {
  const now = new Date();

  const offset = now.getTimezoneOffset();

  const localDate = new Date(
    now.getTime() - offset * 60 * 1000,
  );

  return localDate.toISOString().slice(0, 10);
}

function getMaxDate(
  startDateString: string,
) {
  if (!startDateString) {
    return "";
  }

  const date = new Date(
    `${startDateString}T00:00:00`,
  );

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  date.setDate(
    date.getDate() +
      MAX_EVENT_DURATION_DAYS,
  );

  const offset =
    date.getTimezoneOffset();

  const localDate = new Date(
    date.getTime() -
      offset * 60 * 1000,
  );

  return localDate
    .toISOString()
    .slice(0, 10);
}

export default function EventSettings({
  event,
}: Props) {
  const plan = EVENT_PLANS[event.plan];
  const [name, setName] = useState(
    event.name,
  );

  // ----------------------------------------
  // イベント開始日時
  // ----------------------------------------

  const [eventStartAt, setEventStartAt] =
    useState(
      toDateLocal(event.event_start_at),
    );

  // ----------------------------------------
  // イベント終了日時
  // ----------------------------------------

  const [
    hasEventDeadline,
    setHasEventDeadline,
  ] = useState(
    Boolean(event.event_deadline)
  );

  const [
    eventDeadline,
    setEventDeadline,
  ] = useState(
    toDateLocal(event.event_deadline)
  );

  // ----------------------------------------
  // その他の設定
  // ----------------------------------------

  const [isPublic, setIsPublic] =
    useState(event.is_public);

  const [
    allowGuestDownload,
    setAllowGuestDownload,
  ] = useState(
    event.allow_guest_download,
  );

  // ----------------------------------------
  // 保存状態
  // ----------------------------------------

  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");
  
  const minDate = getMinDate();

  const maxEventDate = getMaxDate(eventStartAt);

  const startDate = new Date(eventStartAt);

  async function handleSave() {
    setSaving(true);
    setMessage("");
    setError("");

    // ----------------------------------------
    // 基本バリデーション
    // ----------------------------------------

    const trimmedName =
      name.trim();

    if (!trimmedName) {
      setError(
        "イベント名を入力してください。",
      );
      setSaving(false);
      return;
    }

    // ----------------------------------------
    // イベント開始日
    // ----------------------------------------

    if (!eventStartAt) {
      setError(
        "イベント開始日を設定してください。",
      );
      setSaving(false);
      return;
    }

    // 今日より前の日付は禁止
    if (eventStartAt < minDate) {
      setError(
        "イベント開始日は今日以降の日付を設定してください。",
      );
      setSaving(false);
      return;
    }

    // ----------------------------------------
    // イベント終了日
    // ----------------------------------------

    if (
      hasEventDeadline &&
      !eventDeadline
    ) {
      setError(
        "イベント終了日を設定してください。",
      );
      setSaving(false);
      return;
    }

    if (
      hasEventDeadline &&
      eventDeadline
    ) {
      // 開始日より前は禁止
      if (eventDeadline < eventStartAt) {
        setError(
          "イベント終了日は開始日以降の日付を設定してください。",
        );
        setSaving(false);
        return;
      }

      // 最大14日間
      const startDate = new Date(
        `${eventStartAt}T00:00:00`,
      );

      const endDate = new Date(
        `${eventDeadline}T00:00:00`,
      );

      const maxEventDuration =
        MAX_EVENT_DURATION_DAYS *
        24 *
        60 *
        60 *
        1000;

      if (
        endDate.getTime() -
          startDate.getTime() >
        maxEventDuration
      ) {
        setError(
          `イベント期間は最大${MAX_EVENT_DURATION_DAYS}日間です。`,
        );
        setSaving(false);
        return;
      }
    }

    // ----------------------------------------
    // 保存
    // ----------------------------------------

    try {
      await updateEventSettings({
        eventId: event.id,
        name: trimmedName,

        eventStartAt:
          new Date(
            `${eventStartAt}T00:00:00`,
          ).toISOString(),

        eventDeadline:
          hasEventDeadline &&
          eventDeadline
            ? new Date(
                `${eventDeadline}T00:00:00`,
              ).toISOString()
            : null,

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
        イベント設定
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
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black"
          />
        </div>

        {/* ---------------------------------------- */}
        {/* 最大アップロード枚数 */}
        {/* ---------------------------------------- */}

        <div>
          <label
            htmlFor="max-upload-count"
            className="mb-2 block text-sm font-medium text-gray-900"
          >
            1人あたりのアップロード枚数
          </label>

          <input
            id="max-upload-count"
            type="number"
            value={plan.maxUploadCount}
            disabled
            readOnly
            className="w-full rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-500 outline-none"
          />

          <p className="mt-2 text-xs text-gray-400">
            {plan.name}プランでは、最大 {plan.maxUploadCount.toLocaleString()} 枚までアップロードできます。
          </p>

        </div>

        {/* ---------------------------------------- */}
        {/* イベント開催期間 */}
        {/* ---------------------------------------- */}

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-900">
            イベント開催期間
          </label>

          <div className="space-y-3">
            {/* 開始日時 */}
            <div>
              <label
                htmlFor="event-start-at"
                className="mb-1 block text-xs text-gray-500"
              >
                開始日時
              </label>

              <input
                id="event-start-at"
                type="date"
                min={minDate}
                max={
                  maxEventDate ||
                  undefined
                }
                value={eventStartAt}
                onChange={(event) => {
                  const value =
                    event.target.value;

                  setEventStartAt(value);

                  // 開始日時を変更して、
                  // 現在の終了日時が14日を超える場合は
                  // 自動的に14日後へ調整
                  if (
                    eventDeadline &&
                    value
                  ) {
                    const maxDate = getMaxDate(value);

                    if (maxDate && eventDeadline > maxDate) {
                      setEventDeadline(maxDate);
                    }
                  }
                }}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black"
              />
            </div>

            {/* 終了日時 */}
            <div>
              <label
                htmlFor="event-deadline"
                className="mb-1 block text-xs text-gray-500"
              >
                終了日時
              </label>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setHasEventDeadline(
                      true,
                    );

                    if (
                      !eventDeadline
                    ) {
                      setEventDeadline(
                        getMaxDate(
                          eventStartAt,
                        ) ||
                          eventStartAt ||
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
                  終了日時を設定
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setHasEventDeadline(
                      false,
                    );
                    setEventDeadline(
                      "",
                    );
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
                  min={
                    eventStartAt ||
                    minDate
                  }
                  max={
                    maxEventDate ||
                    undefined
                  }
                  value={
                    eventDeadline
                  }
                  onChange={(event) =>
                    setEventDeadline(
                      event.target.value,
                    )
                  }
                  className="mt-3 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black"
                />
              )}
            </div>
          </div>

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
              setIsPublic(
                !isPublic,
              )
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
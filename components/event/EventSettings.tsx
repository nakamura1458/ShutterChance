"use client";

import { useState } from "react";

import { updateEventSettings } from "@/actions/event.actions";

type Props = {
  event: {
    id: string;
    name: string;
    max_upload_count: number;
    upload_deadline: string | null;
    event_deadline: string | null;
    is_public: boolean;
    allow_guest_download: boolean;
  };
};

function toDateTimeLocal(value: string | null) {
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

  return localDate.toISOString().slice(0, 16);
}

function getMinDateTime() {
  const now = new Date();

  const offset = now.getTimezoneOffset();

  const localDate = new Date(
    now.getTime() - offset * 60 * 1000,
  );

  return localDate.toISOString().slice(0, 16);
}

export default function EventSettings({
  event,
}: Props) {
  const [name, setName] = useState(event.name);

  const [maxUploadCount, setMaxUploadCount] =
    useState(String(event.max_upload_count));

  // 写真アップロード期限
  const [hasUploadDeadline, setHasUploadDeadline] =
    useState(Boolean(event.upload_deadline));

  const [uploadDeadline, setUploadDeadline] =
    useState(
      toDateTimeLocal(event.upload_deadline),
    );

  // イベント終了日
  const [hasEventDeadline, setHasEventDeadline] =
    useState(Boolean(event.event_deadline));

  const [eventDeadline, setEventDeadline] =
    useState(
      toDateTimeLocal(event.event_deadline),
    );

  // その他の設定
  const [isPublic, setIsPublic] =
    useState(event.is_public);

  const [allowGuestDownload, setAllowGuestDownload] =
    useState(event.allow_guest_download);

  // 保存状態
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSave() {
    setSaving(true);
    setMessage("");
    setError("");

    // ----------------------------------------
    // 基本バリデーション
    // ----------------------------------------

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("イベント名を入力してください。");
      setSaving(false);
      return;
    }

    const uploadCount = Number(maxUploadCount);

    if (
      !Number.isInteger(uploadCount) ||
      uploadCount < 1
    ) {
      setError(
        "アップロード枚数は1以上で指定してください。",
      );
      setSaving(false);
      return;
    }

    // ----------------------------------------
    // 期限バリデーション
    // ----------------------------------------

    if (hasUploadDeadline && !uploadDeadline) {
      setError(
        "写真アップロード期限を設定してください。",
      );
      setSaving(false);
      return;
    }

    if (hasEventDeadline && !eventDeadline) {
      setError(
        "イベント終了日を設定してください。",
      );
      setSaving(false);
      return;
    }

    if (hasUploadDeadline && uploadDeadline) {
      const uploadDate = new Date(uploadDeadline);

      if (uploadDate.getTime() <= Date.now()) {
        setError(
          "写真アップロード期限は現在より後の日時を設定してください。",
        );
        setSaving(false);
        return;
      }
    }

    if (hasEventDeadline && eventDeadline) {
      const eventDate = new Date(eventDeadline);

      if (eventDate.getTime() <= Date.now()) {
        setError(
          "イベント終了日は現在より後の日時を設定してください。",
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
        maxUploadCount: uploadCount,

        uploadDeadline:
          hasUploadDeadline && uploadDeadline
            ? new Date(
                uploadDeadline,
              ).toISOString()
            : null,

        eventDeadline:
          hasEventDeadline && eventDeadline
            ? new Date(
                eventDeadline,
              ).toISOString()
            : null,

        isPublic,
        allowGuestDownload,
      });

      setMessage("設定を保存しました。");
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

  const minDateTime = getMinDateTime();

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
              setName(event.target.value)
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
            min={1}
            value={maxUploadCount}
            onChange={(event) =>
              setMaxUploadCount(event.target.value)
            }
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black"
          />

          <p className="mt-2 text-xs text-gray-400">
            ゲスト1人がアップロードできる写真の最大枚数です。
          </p>
        </div>

        {/* ---------------------------------------- */}
        {/* 写真アップロード期限 */}
        {/* ---------------------------------------- */}

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-900">
            写真アップロード期限
          </label>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setHasUploadDeadline(true);

                if (!uploadDeadline) {
                  setUploadDeadline(
                    minDateTime,
                  );
                }
              }}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                hasUploadDeadline
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              期限を設定
            </button>

            <button
              type="button"
              onClick={() => {
                setHasUploadDeadline(false);
                setUploadDeadline("");
              }}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                !hasUploadDeadline
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              期限なし
            </button>
          </div>

          {hasUploadDeadline && (
            <input
              id="upload-deadline"
              type="datetime-local"
              min={minDateTime}
              value={uploadDeadline}
              onChange={(event) =>
                setUploadDeadline(
                  event.target.value,
                )
              }
              className="mt-3 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black"
            />
          )}

          <p className="mt-2 text-xs text-gray-400">
            期限を過ぎるとゲストは写真をアップロードできなくなります。
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
                    minDateTime,
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
              type="datetime-local"
              min={minDateTime}
              value={eventDeadline}
              onChange={(event) =>
                setEventDeadline(
                  event.target.value,
                )
              }
              className="mt-3 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black"
            />
          )}

          <p className="mt-2 text-xs text-gray-400">
            未設定の場合はイベント終了日の制限はありません。
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
          {saving ? "保存中..." : "変更を保存"}
        </button>
      </div>
    </section>
  );
}
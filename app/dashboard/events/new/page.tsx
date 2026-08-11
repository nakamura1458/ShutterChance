"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase/client";

function getMinDateTime() {
  const now = new Date();

  const offset = now.getTimezoneOffset();

  const localDate = new Date(
    now.getTime() - offset * 60 * 1000,
  );

  return localDate.toISOString().slice(0, 16);
}

export default function NewEventPage() {
  const router = useRouter();

  // ----------------------------------------
  // 基本情報
  // ----------------------------------------

  const [name, setName] = useState("");

  const [maxUploadCount, setMaxUploadCount] =
    useState("30");

  // ----------------------------------------
  // 写真アップロード期限
  // ----------------------------------------

  const [hasUploadDeadline, setHasUploadDeadline] =
    useState(false);

  const [uploadDeadline, setUploadDeadline] =
    useState("");

  // ----------------------------------------
  // イベント終了日
  // ----------------------------------------

  const [hasEventDeadline, setHasEventDeadline] =
    useState(false);

  const [eventDeadline, setEventDeadline] =
    useState("");

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

    const uploadCount = Number(maxUploadCount);

    if (
      !Number.isInteger(uploadCount) ||
      uploadCount < 1
    ) {
      setError(
        "アップロード枚数は1以上で指定してください。",
      );
      setLoading(false);
      return;
    }

    // ----------------------------------------
    // 期限バリデーション
    // ----------------------------------------

    if (hasUploadDeadline && !uploadDeadline) {
      setError(
        "写真アップロード期限を設定してください。",
      );
      setLoading(false);
      return;
    }

    if (hasEventDeadline && !eventDeadline) {
      setError(
        "イベント終了日を設定してください。",
      );
      setLoading(false);
      return;
    }

    // ----------------------------------------
    // 日時チェック
    // ----------------------------------------

    if (hasUploadDeadline && uploadDeadline) {
      const uploadDate = new Date(uploadDeadline);

      if (uploadDate.getTime() <= Date.now()) {
        setError(
          "写真アップロード期限は現在より後の日時を設定してください。",
        );
        setLoading(false);
        return;
      }
    }

    if (hasEventDeadline && eventDeadline) {
      const eventDate = new Date(eventDeadline);

      if (eventDate.getTime() <= Date.now()) {
        setError(
          "イベント終了日は現在より後の日時を設定してください。",
        );
        setLoading(false);
        return;
      }
    }

    // ----------------------------------------
    // ログインユーザー取得
    // ----------------------------------------

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      router.push("/login");
      return;
    }

    // ----------------------------------------
    // イベントトークン生成
    // ----------------------------------------

    const eventToken = crypto.randomUUID();

    // ----------------------------------------
    // イベント作成
    // ----------------------------------------

    const { error: insertError } = await supabase
      .from("events")
      .insert({
        name: trimmedName,
        event_token: eventToken,
        user_id: user.id,

        max_upload_count: uploadCount,

        upload_deadline:
          hasUploadDeadline && uploadDeadline
            ? new Date(
                uploadDeadline,
              ).toISOString()
            : null,

        event_deadline:
          hasEventDeadline && eventDeadline
            ? new Date(
                eventDeadline,
              ).toISOString()
            : null,

        is_public: true,
        allow_guest_download: true,
      });

    if (insertError) {
      console.error(insertError);

      setError(insertError.message);
      setLoading(false);
      return;
    }

    // ----------------------------------------
    // ダッシュボードへ
    // ----------------------------------------

    router.push("/dashboard");
  }

  const minDateTime = getMinDateTime();

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
                  setMaxUploadCount(
                    event.target.value,
                  )
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
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
                  className="mt-3 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
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
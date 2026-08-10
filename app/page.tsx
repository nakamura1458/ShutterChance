"use client";

import { useState } from "react";
import { ArrowRight, Camera, CloudUpload, Images } from "lucide-react";
import { useRouter } from "next/navigation";

import { checkEventToken } from "@/actions/event.actions";

export default function Home() {
  const router = useRouter();

  const [eventToken, setEventToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEnterEvent = async () => {
    const token = eventToken.trim();

    if (!token) {
      setError("イベントコードを入力してください");
      return;
    }

    setError("");
    setLoading(true);

    const result = await checkEventToken(token);

    if (!result.success) {
      setError(result.message);
      setLoading(false);
      return;
    }

    router.push(`/e/${result.eventToken}`);
  };

  return (
    <main className="min-h-screen bg-white px-5 py-10 sm:px-6 sm:py-16">
      <div className="mx-auto w-full max-w-md text-center">
        {/* Logo */}
        <div className="mb-3">
          <h1 className="text-2xl font-bold uppercase tracking-[0.2em] sm:text-3xl">
            Shutter Chance
          </h1>
        </div>

        {/* Catch Copy */}
        <p className="mb-8 text-sm leading-relaxed text-gray-600 sm:mb-10">
          思い出を、みんなの写真で。
          <br />
          イベントの写真をみんなで共有しよう。
        </p>

        {/* Event Token */}
        <div className="text-left">
          <label
            htmlFor="eventToken"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            イベントコード
          </label>

          <input
            id="eventToken"
            type="text"
            value={eventToken}
            onChange={(e) => {
              setEventToken(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleEnterEvent();
              }
            }}
            placeholder="イベントコードを入力"
            className="w-full rounded-xl border border-gray-300 px-4 py-3.5 text-center text-lg tracking-wider outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
          />

          {error && (
            <p className="mt-2 text-sm text-red-500">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={handleEnterEvent}
            disabled={!eventToken.trim() || loading}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-black px-4 py-3.5 font-medium text-white transition hover:bg-gray-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? "確認中..." : "イベントを見る"}

            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
        </div>

        {/* What is Shutter Chance? */}
        <section className="mt-12 border-t border-gray-100 pt-10 sm:mt-16 sm:pt-12">
          <h2 className="text-lg font-bold uppercase tracking-[0.15em] sm:text-xl sm:tracking-[0.25em]">
            Shutter Chanceとは？
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-gray-500">
            イベントで撮った写真を、
            <br />
            みんなで共有できるサービスです。
          </p>

          {/* Steps */}
          <div className="mt-6 grid grid-cols-3 gap-2 sm:mt-8 sm:gap-3">
            {/* Step 1 */}
            <div className="rounded-2xl bg-gray-50 px-2 py-4 sm:px-3 sm:py-5">
              <Camera className="mx-auto h-5 w-5 sm:h-6 sm:w-6" />

              <p className="mt-2 text-sm font-medium sm:mt-3">
                撮る
              </p>

              <p className="mt-1 text-[11px] leading-relaxed text-gray-500 sm:text-xs">
                写真を撮影
              </p>
            </div>

            {/* Step 2 */}
            <div className="rounded-2xl bg-gray-50 px-2 py-4 sm:px-3 sm:py-5">
              <CloudUpload className="mx-auto h-5 w-5 sm:h-6 sm:w-6" />

              <p className="mt-2 text-sm font-medium sm:mt-3">
                共有
              </p>

              <p className="mt-1 text-[11px] leading-relaxed text-gray-500 sm:text-xs">
                写真をアップロード
              </p>
            </div>

            {/* Step 3 */}
            <div className="rounded-2xl bg-gray-50 px-2 py-4 sm:px-3 sm:py-5">
              <Images className="mx-auto h-5 w-5 sm:h-6 sm:w-6" />

              <p className="mt-2 text-sm font-medium sm:mt-3">
                楽しむ
              </p>

              <p className="mt-1 text-[11px] leading-relaxed text-gray-500 sm:text-xs">
                みんなの写真を見る
              </p>
            </div>
          </div>

          {/* Organizer */}
          <section className="mt-10 border-t border-gray-100 pt-10 sm:mt-12 sm:pt-12">
            <h2 className="text-lg font-semibold">
              イベントを開催する方へ
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-gray-500">
              結婚式やパーティーの写真を、
              <br />
              みんなで集めてみませんか？
            </p>

            <button
              type="button"
              className="mt-5 w-full rounded-xl border border-gray-300 px-4 py-3.5 font-medium text-gray-900 transition hover:bg-gray-50 active:scale-[0.98]"
            >
              イベントを作成する
            </button>
          </section>
        </section>
      </div>

      {/* Footer */}
      <footer className="mx-auto mt-12 max-w-md border-t border-gray-100 pt-7 pb-2 sm:mt-16 sm:pt-8">
        <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
          <button
            type="button"
            className="transition hover:text-gray-600"
          >
            利用規約
          </button>

          <span>・</span>

          <button
            type="button"
            className="transition hover:text-gray-600"
          >
            プライバシーポリシー
          </button>
        </div>

        <p className="mt-4 text-center text-xs text-gray-400">
          © 2026 Shutter Chance
        </p>
      </footer>
    </main>
  );
}
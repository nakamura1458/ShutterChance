"use client";

import { useState } from "react";
import { ArrowRight, Images } from "lucide-react";
import { useRouter } from "next/navigation";

import { checkEventToken } from "@/actions/event.actions";

export default function GuestEntry() {
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
    <section className="px-5 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-md rounded-3xl bg-gray-50 p-7 text-center sm:p-9">
        <Images className="mx-auto h-6 w-6" />

        <h2 className="mt-4 text-lg font-bold">
          ゲストの方はこちら
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          イベントコードを入力して参加できます。
        </p>

        <div className="mt-6">
          <input
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
            placeholder="イベントコード"
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-center text-base tracking-wider outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
          />

          {error && (
            <p className="mt-2 text-left text-sm text-red-500">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={handleEnterEvent}
            disabled={!eventToken.trim() || loading}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-black px-4 py-3.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? "確認中..." : "イベントを見る"}

            {!loading && (
              <ArrowRight className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
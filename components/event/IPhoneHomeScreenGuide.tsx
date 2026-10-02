"use client";

import { X, Share } from "lucide-react";
import { Ellipsis } from "lucide-react";

type Props = {
  onClose: () => void;
  onComplete: () => void;
};

export default function IPhoneHomeScreenGuide({
  onClose,
  onComplete,
}: Props) {
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 p-4 sm:items-center">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-gray-900 p-5 text-white shadow-2xl ring-1 ring-black/20">
        {/* Decorative background */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-12 -left-8 h-24 w-24 rounded-full bg-white/5" />

        {/* Header */}
        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400">
              Shutter Chance
            </p>

            <h2 className="mt-1 text-lg font-semibold leading-7 text-white">
              ホーム画面に追加する方法
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              iPhoneでは次の3ステップで追加できます。
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="閉じる"
            className="rounded-full p-2 text-gray-400 transition hover:bg-white/10 hover:text-white active:scale-95"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Steps */}
        <div className="relative mt-5 space-y-3">
          {/* Step 1 */}
          <div className="rounded-xl bg-white/10 p-4 ring-1 ring-white/10">
            <p className="text-[11px] font-semibold tracking-[0.15em] text-gray-400">
              STEP 1
            </p>

            <div className="mt-1 flex items-center gap-1 text-sm font-semibold text-white">
              <span>Safariの</span>
              <span className="inline-flex items-center justify-center rounded-md bg-white/10 px-1">
                <Ellipsis className="h-4 w-4" />
              </span>
              <span>ボタンをタップ</span>
            </div>

            <p className="mt-1 text-sm leading-6 text-gray-300">
              <span>共有ボタン</span>
              <span className="mx-1 inline-flex h-6 w-6 items-center justify-center rounded-md bg-white/10 align-middle">
                <Share className="h-3.5 w-3.5 text-white" />
              </span>
              <span>をタップします。</span>
            </p>
          </div>

          {/* Step 2 */}
          <div className="rounded-xl bg-white/10 p-4 ring-1 ring-white/10">
            <p className="text-[11px] font-semibold tracking-[0.15em] text-gray-400">
              STEP 2
            </p>

            <p className="mt-1 text-sm font-semibold text-white">
              「表示を増やす」をタップ
            </p>
            <p className="mt-1 text-sm leading-6 text-gray-300">
              共有メニューが表示されたら、 「表示を増やす」をタップします。 
            </p>
          </div>

          {/* Step 3 */}
          <div className="rounded-xl bg-white/10 p-4 ring-1 ring-white/10">
            <p className="text-[11px] font-semibold tracking-[0.15em] text-gray-400">
              STEP 3
            </p>

            <p className="mt-1 text-sm font-semibold text-white">
              「ホーム画面に追加」をタップ
            </p>

            <p className="mt-1 text-sm leading-6 text-gray-300">
              表示されたメニューから
              「ホーム画面に追加」を選択します。
            </p>
          </div>

          {/* Step 4 */}
          <div className="rounded-xl bg-white/10 p-4 ring-1 ring-white/10">
            <p className="text-[11px] font-semibold tracking-[0.15em] text-gray-400">
              STEP 4
            </p>

            <p className="mt-1 text-sm font-semibold text-white">
              「追加」をタップ
            </p>

            <p className="mt-1 text-sm leading-6 text-gray-300">
              右上の「追加」をタップすると完了です。
            </p>
          </div>
        </div>

        {/* Complete */}
        <button
          type="button"
          onClick={onComplete}
          className="relative mt-5 w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-100 active:scale-[0.98]"
        >
          わかりました
        </button>
      </div>
    </div>
  );
}
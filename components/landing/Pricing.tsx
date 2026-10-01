"use client";

import { useRouter } from "next/navigation";

const plans = [
  {
    id: "free",
    name: "FREE",
    price: "¥ 0",
    description: "まずは気軽に試したい方に",
    maxUpload: "最大 50 枚",
    retention: "7 日間保存",
    recommended: false,
  },
  {
    id: "light",
    name: "LIGHT",
    price: "¥ 1,980",
    description: "小規模なイベントに",
    maxUpload: "最大 300 枚",
    retention: "30 日間保存",
    recommended: false,
  },
  {
    id: "standard",
    name: "STANDARD",
    price: " ¥ 3,980",
    description: "結婚式など一般的なイベントに",
    maxUpload: "最大 1,000 枚",
    retention: "60 日間保存",
    recommended: true,
  },
  // {
  //   id: "plus",
  //   name: "PLUS",
  //   price: " ¥4,980",
  //   description: "長めに写真を残したい方に",
  //   maxUpload: "最大1,000枚",
  //   retention: "90日間保存",
  //   recommended: false,
  // },
  {
    id: "premium",
    name: "PREMIUM",
    price: "¥ 6,980",
    description: "大規模なイベントに",
    maxUpload: "最大 3,000 枚",
    retention: "90 日間保存",
    recommended: false,
  },
];

function PriceFeature({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-black">
        <span className="text-xs text-white">✓</span>
      </div>

      <p className="text-sm text-gray-600">
        {text}
      </p>
    </div>
  );
}

export default function Pricing() {
  const router = useRouter();

  const handleSelectPlan = (planId: string) => {
    router.push(`/dashboard/events/new?plan=${planId}`);
  };

  return (
    <section
      id="pricing"
      className="border-t border-gray-100 bg-gray-50 px-5 py-20 sm:px-6 sm:py-28"
    >
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">
            Simple pricing
          </p>

          <h2 className="mt-4 text-2xl font-bold sm:text-3xl">
            主催者だけが支払う
          </h2>

          <p className="mt-5 text-sm leading-7 text-gray-500">
            ゲストは無料。
            <br />
            アプリのインストールも必要ありません。
          </p>
        </div>

        {/* Plans */}
        <div className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-5 scrollbar-none">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="w-[82vw] max-w-[340px] shrink-0 snap-center"
            >
              <div className="relative h-full rounded-3xl bg-white p-7 shadow-sm ring-1 ring-gray-100">
                {plan.recommended && (
                  <div className="absolute right-5 top-5 rounded-full bg-black px-3 py-1 text-[10px] font-semibold tracking-wider text-white">
                    おすすめ
                  </div>
                )}

                <p className="text-xs font-semibold tracking-[0.2em] text-gray-400">
                  {plan.name}
                </p>

                <p className="mt-4 text-3xl font-bold text-gray-950">
                  {plan.price}
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  {plan.description}
                </p>

                <div className="mt-6 space-y-3">
                  <PriceFeature text={plan.maxUpload} />
                  <PriceFeature text={plan.retention} />
                  <PriceFeature text="ゲストは無料" />
                  <PriceFeature text="アプリのインストール不要" />
                </div>

                <button
                  type="button"
                  onClick={() => handleSelectPlan(plan.id)}
                  className="mt-7 w-full rounded-full border border-gray-300 px-5 py-3.5 text-sm font-medium transition hover:bg-gray-50"
                >
                  このプランで始める
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile hint */}
        <p className="mt-2 text-center text-xs text-gray-400 sm:hidden">
          ← スワイプしてプランを見る →
        </p>
      </div>
    </section>
  );
}
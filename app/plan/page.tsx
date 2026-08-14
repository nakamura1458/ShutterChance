import Link from "next/link";

import { getActivePlans } from "@/services/plan.service";

export default async function PlansPage() {
  const plans = await getActivePlans();

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-6 py-12">
        {/* =========================
            Header
        ========================= */}
        <header className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">
            Plans
          </p>

          <h1 className="mt-4 text-3xl font-semibold">
            プランを選択
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            イベントの規模や用途に合わせて、
            <br />
            最適なプランを選択してください。
          </p>
        </header>

        {/* =========================
            Plans
        ========================= */}
        {plans.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
            <p className="text-sm text-gray-500">
              現在利用できるプランがありません。
            </p>
          </div>
        ) : (
          <div className="mt-12 space-y-5">
            {plans.map((plan) => {
              const planInfo = getPlanInfo(plan.name);

              return (
                <div
                  key={plan.id}
                  className={`relative rounded-3xl bg-white p-7 shadow-sm ring-1 sm:p-8 ${
                    planInfo.recommended
                      ? "ring-2 ring-black"
                      : "ring-gray-100"
                  }`}
                >
                  {/* Recommended */}
                  {planInfo.recommended && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-black px-4 py-1.5 text-xs font-medium text-white">
                      おすすめ
                    </div>
                  )}

                  {/* Plan Header */}
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h2 className="text-xl font-semibold">
                        {plan.name}
                      </h2>

                      <p className="mt-2 text-sm font-medium text-gray-700">
                        {planInfo.subtitle}
                      </p>

                      <p className="mt-2 text-sm leading-6 text-gray-500">
                        {planInfo.description}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="shrink-0 sm:text-right">
                      <span className="text-3xl font-bold">
                        ¥{plan.price.toLocaleString()}
                      </span>

                      <span className="ml-1 text-sm text-gray-500">
                        /イベント
                      </span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mt-7 grid gap-3 border-t border-gray-100 pt-6 sm:grid-cols-2">
                    <PlanFeature
                      title="アップロード枚数"
                      value={`${plan.max_upload_count.toLocaleString()}枚まで`}
                      description="イベント全体でアップロードできる写真の上限です。"
                    />

                    <PlanFeature
                      title="写真の保存期間"
                      value={`${plan.retention_days}日間`}
                      description="イベント終了後も写真を閲覧・保存できます。"
                    />
                  </div>

                  {/* Detail */}
                  <div className="mt-6 rounded-2xl bg-gray-50 px-5 py-4">
                    <p className="text-sm leading-6 text-gray-600">
                      {planInfo.detail}
                    </p>
                  </div>

                  {/* Select */}
                  <Link
                    href={`/dashboard/events/new?plan=${plan.id}`}
                    className="mt-6 block w-full rounded-xl bg-black px-4 py-3.5 text-center text-sm font-medium text-white transition hover:bg-gray-800"
                  >
                    このプランを選択してイベントを作成する
                  </Link>
                </div>
              );
            })}
          </div>
        )}

        {/* =========================
            Back
        ========================= */}
        <div className="mt-10 text-center">
          <Link
            href="/"
            className="text-sm text-gray-500 underline underline-offset-4 transition hover:text-black"
          >
            トップページに戻る
          </Link>
        </div>
      </div>
    </main>
  );
}

/* =========================
   Plan Info
========================= */

function getPlanInfo(name: string) {
  switch (name.toLowerCase()) {
    case "free":
      return {
        subtitle: "まずは試してみたい方へ",
        description:
          "ShutterChanceを気軽に体験できる無料プランです。",
        detail:
          "小規模なイベントや、まずはShutterChanceを試してみたい場合におすすめです。",
        recommended: false,
      };

    case "light":
      return {
        subtitle: "小規模イベント向け",
        description:
          "少人数のパーティーや小規模なイベントにおすすめのプランです。",
        detail:
          "少人数のイベントで必要な写真をしっかり集めたい方におすすめです。",
        recommended: false,
      };

    case "standard":
      return {
        subtitle: "普通のイベント向け",
        description:
          "結婚式やパーティーなど、一般的なイベントにおすすめのスタンダードプランです。",
        detail:
          "迷った場合はこちらがおすすめ。一般的なイベントに必要な容量と保存期間をバランスよく利用できます。",
        recommended: true,
      };

    case "premium":
      return {
        subtitle: "大規模イベント向け",
        description:
          "たくさんのゲストが参加する大規模イベントにおすすめのプランです。",
        detail:
          "多くのゲストから大量の写真を集めたいイベントでも、余裕を持って利用できます。",
        recommended: false,
      };

    default:
      return {
        subtitle: "イベント向けプラン",
        description:
          "イベントの写真をみんなで共有できます。",
        detail:
          `最大${0}枚の写真を保存できます。`,
        recommended: false,
      };
  }
}

/* =========================
   Components
========================= */

function PlanFeature({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4">
      <p className="text-xs font-medium text-gray-400">
        {title}
      </p>

      <p className="mt-1 text-base font-semibold">
        {value}
      </p>

      <p className="mt-1 text-xs leading-5 text-gray-500">
        {description}
      </p>
    </div>
  );
}
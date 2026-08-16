import { Check } from "lucide-react";

function PriceFeature({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-black">
        <Check className="h-3 w-3 text-white" />
      </div>

      <p className="text-sm text-gray-600">
        {text}
      </p>
    </div>
  );
}

type PricingProps = {
  onViewPlans: () => void;
};

export default function Pricing({
  onViewPlans,
}: PricingProps) {
  return (
    <section
      id="pricing"
      className="border-t border-gray-100 bg-gray-50 px-5 py-20 sm:px-6 sm:py-28"
    >
      <div className="mx-auto max-w-3xl text-center">
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

        <div className="mx-auto mt-10 max-w-sm rounded-3xl bg-white p-7 text-left shadow-sm ring-1 ring-gray-100">
          <div className="space-y-4">
            <PriceFeature text="ゲストは無料" />
            <PriceFeature text="アプリのインストール不要" />
            <PriceFeature text="QRコードでかんたん参加" />
            <PriceFeature text="みんなの写真をまとめて管理" />
          </div>

          <button
            type="button"
            onClick={onViewPlans}
            className="mt-7 w-full rounded-full border border-gray-300 px-5 py-3.5 text-sm font-medium transition hover:bg-gray-50"
          >
            料金プランを見る
          </button>
        </div>
      </div>
    </section>
  );
}
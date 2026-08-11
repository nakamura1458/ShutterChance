"use client";

type Plan = {
  id: string;
  name: string;
  price: number;
  max_upload_count: number;
  retention_days: number;
  is_active: boolean;
};

type Props = {
  plans: Plan[];
  selectedPlan: string;
  onSelect: (planId: string) => void;
};

export default function PlanSelector({
  plans,
  selectedPlan,
  onSelect,
}: Props) {
  return (
    <div>
      <label className="mb-3 block text-sm font-medium text-gray-900">
        料金プラン
      </label>

      <div className="space-y-3">
        {plans.map((plan) => (
          <button
            key={plan.id}
            type="button"
            onClick={() => onSelect(plan.id)}
            className={`w-full rounded-xl border p-4 text-left transition ${
              selectedPlan === plan.id
                ? "border-black bg-gray-50"
                : "border-gray-200 hover:border-gray-400"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">
                  {plan.name}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  {plan.max_upload_count.toLocaleString()}
                  枚まで
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  保存期間 {plan.retention_days}日
                </p>
              </div>

              <p className="font-semibold">
                {plan.price === 0
                  ? "0円"
                  : `${plan.price.toLocaleString()}円`}
              </p>
            </div>
          </button>
        ))}
      </div>

      <p className="mt-2 text-xs text-gray-400">
        イベントごとに料金が発生します。
      </p>
    </div>
  );
}
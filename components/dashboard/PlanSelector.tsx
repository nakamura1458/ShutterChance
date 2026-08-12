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
        {plans
          .filter((plan) => plan.is_active)
          .map((plan) => {
            const isSelected = selectedPlan === plan.id;
            const isRecommended = plan.id === "standard";

            return (
              <button
                key={plan.id}
                type="button"
                onClick={() => onSelect(plan.id)}
                className={`w-full rounded-xl border text-left transition ${
                  isSelected
                    ? "border-black bg-gray-50"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                {/* プラン概要 */}
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* 選択状態 */}
                      <span
                        className={`text-xl leading-none ${
                          isSelected
                            ? "text-black"
                            : "text-gray-400"
                        }`}
                      >
                        {isSelected ? "●" : "○"}
                      </span>

                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">
                            {plan.name}
                          </p>

                          {isRecommended && (
                            <span className="rounded-full bg-black px-2 py-0.5 text-[10px] font-medium text-white">
                              おすすめ
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-sm text-gray-500">
                          {plan.max_upload_count.toLocaleString()}
                          枚まで
                        </p>
                      </div>
                    </div>

                    <p className="font-semibold">
                      {plan.price === 0
                        ? "0円"
                        : `${plan.price.toLocaleString()}円`}
                    </p>
                  </div>
                </div>

                {/* 選択中のみ詳細表示 */}
                {isSelected && (
                  <div className="border-t border-gray-200 px-4 py-4">
                    <p className="mb-3 text-sm font-medium text-gray-900">
                      プラン詳細
                    </p>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>アップロード枚数</span>

                        <span className="font-medium text-gray-900">
                          {plan.max_upload_count.toLocaleString()} 枚まで
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span>保存期間</span>

                        <span className="font-medium text-gray-900">
                          イベント終了後 {plan.retention_days} 日間
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span>料金</span>

                        <span className="font-medium text-gray-900">
                          {plan.price === 0
                            ? "無料"
                            : `${plan.price.toLocaleString()} 円`}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </button>
            );
          })}
      </div>

      <p className="mt-2 text-xs text-gray-400">
        イベントごとに料金が発生します。
      </p>
    </div>
  );
}
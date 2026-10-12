"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "ゲストも会員登録やアプリのインストールが必要ですか？",
    answer:
      "いいえ、ゲストの会員登録やアプリのインストールは不要です。イベントごとに発行されるQRコードやイベント専用URLからアクセスして、スマートフォンで写真を共有できます。",
  },
  {
    question: "ゲストは無料で写真を共有できますか？",
    answer:
      "はい、ゲストは無料で利用できます。料金が発生するのはイベントを作成する主催者のみです。ゲストは追加料金なしでイベントに参加し、写真をアップロードできます。",
  },
  {
    question: "どんなイベントの写真共有に利用できますか？",
    answer:
      "結婚式や二次会、誕生日パーティー、同窓会、旅行、社内イベント、懇親会など、参加者みんなで写真を共有したいさまざまなイベントで利用できます。",
  },
  {
    question: "QRコードを使って写真を共有できますか？",
    answer:
      "はい。イベント専用のQRコードを用意できるので、参加者はスマートフォンで読み取るだけでイベントにアクセスできます。招待状や案内カード、会場に置く案内などにQRコードを掲載しておくと、写真共有への参加をスムーズに案内できます。",
  },
  {
    question: "スマートフォンで撮影した写真をアップロードできますか？",
    answer:
      "はい。スマートフォンから写真を選んでアップロードできます。参加者がそれぞれ撮影した写真をイベントごとにまとめて共有できます。",
  },
  {
    question: "写真はどのくらい保存されますか？",
    answer:
      "写真の保存期間はご利用の料金プランによって異なります。イベントの規模や写真を見返したい期間に合わせてプランをお選びください。詳しい保存期間は料金プランをご確認ください。",
  },
  {
    question: "何枚まで写真をアップロードできますか？",
    answer:
      "アップロードできる写真の枚数はご利用の料金プランによって異なります。参加人数やイベントの規模に合わせてプランをお選びください。プランごとのアップロード上限は料金プランをご確認ください。",
  },
  {
    question: "イベントを作成したあとに設定を変更できますか？",
    answer:
      "はい、イベント管理画面からイベント名とイベント終了日を変更できます。変更できる設定には制限があるため、イベント作成前に内容をご確認ください。",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <section
      id="faq"
      className="border-t border-gray-100 bg-gray-50 px-5 py-20 sm:px-6 sm:py-28"
    >
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">
            FAQ
          </p>

          <h2 className="mt-4 text-2xl font-bold sm:text-3xl">
            イベントの写真共有に関するよくある質問
          </h2>

          <p className="mt-5 text-sm leading-7 text-gray-500">
            Shutter Chanceの使い方や料金、
            <br />
            QRコードを使った写真共有についてご紹介します。
          </p>
        </div>

        <div className="mt-12 overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-100">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.question}
                className={
                  index !== faqs.length - 1
                    ? "border-b border-gray-100"
                    : ""
                }
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 px-5 py-5 text-left transition hover:bg-gray-50 sm:px-7"
                >
                  <span className="text-sm font-medium leading-6 text-gray-900">
                    {faq.question}
                  </span>

                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-gray-400 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 sm:px-7 sm:pb-6">
                    <p className="text-sm leading-7 text-gray-500">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
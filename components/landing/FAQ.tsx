"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "ゲストも会員登録が必要ですか？",
    answer:
      "いいえ、ゲストの会員登録は不要です。イベントごとに発行されるQRコードやイベントコードから簡単にイベントに参加できます。",
  },
  {
    question: "ゲストは無料で利用できますか？",
    answer:
      "はい、ゲストは無料で利用できます。料金が発生するのは、イベントを作成する主催者のみです。",
  },
  {
    question: "どんなイベントで利用できますか？",
    answer:
      "結婚式や二次会、パーティー、旅行など、みんなで写真を共有したいさまざまなイベントで利用できます。",
  },
  {
    question: "写真はどのくらい保存されますか？",
    answer:
      "写真の保存期間はご利用のプランによって異なります。詳しくは料金プランをご確認ください。",
  },
  {
    question: "何枚まで写真をアップロードできますか？",
    answer:
      "アップロードできる写真の枚数はご利用のプランによって異なります。プランごとの上限は料金ページでご確認いただけます。",
  },
  {
    question: "イベントを作ったあとに設定を変更できますか？",
    answer:
      "はい、イベント管理画面からイベントに関する設定を変更できます。イベント作成後に変更できるのは、イベント名、イベント終了日のみとなります。",
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
        {/* Heading */}
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">
            FAQ
          </p>

          <h2 className="mt-4 text-2xl font-bold sm:text-3xl">
            よくある質問
          </h2>

          <p className="mt-5 text-sm leading-7 text-gray-500">
            ShutterChanceについて、
            <br />
            よくいただく質問をまとめました。
          </p>
        </div>

        {/* FAQ List */}
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
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type GuideStepData = {
  number: string;
  title: string;
  description: React.ReactNode;
  image: string;
  imageAlt: string;
};

const steps: GuideStepData[] = [
  {
    number: "01",
    title: "お名前を入力",
    description: (
      <>
        写真を送る前に、
        <br />
        お名前を入力してください。
      </>
    ),
    image: "/guide/step-01-name.png",
    imageAlt: "お名前を入力する画面",
  },
  {
    number: "02",
    title: "「撮影を始める」をタップ",
    description: (
      <>
        お名前を入力したら、
        <br />
        「撮影を始める」をタップします。
      </>
    ),
    image: "/guide/step-02-start.png",
    imageAlt: "撮影を始めるボタンの画面",
  },
  {
    number: "03",
    title: "写真を撮影・選択",
    description: (
      <>
        その場で写真を撮影することも、
        <br />
        スマートフォンにある写真を選ぶこともできます。
      </>
    ),
    image: "/guide/step-03-photo.png",
    imageAlt: "写真を撮影・選択する画面",
  },
  {
    number: "04",
    title: "写真をアップロード",
    description: (
      <>
        写真を確認してアップロードします。
        <br />
        これで写真の共有は完了です！
      </>
    ),
    image: "/guide/step-04-upload.png",
    imageAlt: "写真をアップロードする画面",
  },
];

export default function GuideSteps() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const container = scrollRef.current;

    if (!container) return;

    const handleScroll = () => {
      const cards = Array.from(
        container.children,
      ) as HTMLElement[];

      if (cards.length === 0) return;

      const containerCenter =
        container.scrollLeft + container.clientWidth / 2;

      let closestIndex = 0;
      let closestDistance = Infinity;

      cards.forEach((card, index) => {
        const cardCenter =
          card.offsetLeft + card.offsetWidth / 2;

        const distance = Math.abs(
          cardCenter - containerCenter,
        );

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setCurrentStep(closestIndex);
    };

    container.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    handleScroll();

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section>

      {/* Cards */}
      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-4 scrollbar-none"
      >
        {steps.map((step) => (
          <div
            key={step.number}
            className="w-[82vw] max-w-[360px] shrink-0 snap-center"
          >
            <GuideStep {...step} />
          </div>
        ))}
      </div>

      {/* Step indicator */}
      <div className="mb-4 text-center">
        <p className="text-xs font-semibold tracking-widest text-zinc-400">
          STEP {currentStep + 1} / {steps.length}
        </p>

        <div className="mt-3 flex justify-center gap-2">
          {steps.map((_, index) => (
            <span
              key={index}
              className={`h-2 w-2 rounded-full transition-all ${
                currentStep === index
                  ? "bg-zinc-900"
                  : "bg-zinc-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function GuideStep({
  number,
  title,
  description,
  image,
  imageAlt,
}: GuideStepData) {
  return (
    <div className="relative">
      {/* Step number */}
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-xs font-bold text-white">
          {number}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
            STEP {number}
          </p>

          <h3 className="mt-0.5 text-lg font-bold text-zinc-950">
            {title}
          </h3>
        </div>
      </div>

      {/* Screenshot */}
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="relative mx-auto aspect-[9/16] w-full max-w-[320px] bg-zinc-100">
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="320px"
            className="object-contain"
          />
        </div>

        <div className="border-t border-zinc-100 px-5 py-4">
          <p className="text-sm leading-6 text-zinc-600">
            {description}
          </p>
        </div>
      </div>

    </div>
  );
}
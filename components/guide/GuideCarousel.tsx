"use client";

import { useState } from "react";
import Image from "next/image";

export type GuideCarouselStep = {
  number: string;
  title: string;
  description: React.ReactNode;
  image: string;
  imageAlt: string;
};

type GuideCarouselProps = {
  steps: GuideCarouselStep[];
};

export default function GuideCarousel({
  steps,
}: GuideCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const container = event.currentTarget;

    const index = Math.round(
      container.scrollLeft /
        (container.firstElementChild?.clientWidth ??
          container.clientWidth)
    );

    setActiveIndex(
      Math.min(Math.max(index, 0), steps.length - 1)
    );
  };

  return (
    <>
      {/* Steps */}
      <div
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-5 scrollbar-none"
        onScroll={handleScroll}
      >
        {steps.map((step) => (
          <div
            key={step.number}
            className="w-[78vw] max-w-[340px] shrink-0 snap-center"
          >
            <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-100">
              {/* Step information */}
              <div className="px-5 pt-5">
                <p className="text-xs font-semibold tracking-[0.2em] text-gray-400">
                  STEP {step.number} /{" "}
                  {String(steps.length).padStart(2, "0")}
                </p>

                <h3 className="mt-2 text-lg font-bold text-zinc-950">
                  {step.title}
                </h3>

                <div className="mt-2 text-sm leading-6 text-gray-500">
                  {step.description}
                </div>
              </div>

              {/* Image */}
              <div className="mt-5 flex justify-center px-5 pb-5">
                <div className="relative aspect-[9/16] w-full max-w-[240px] overflow-hidden rounded-2xl bg-gray-100">
                  <Image
                    src={step.image}
                    alt={step.imageAlt}
                    fill
                    className="object-cover"
                    sizes="240px"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="mt-2 flex justify-center gap-2">
        {steps.map((step, index) => (
          <div
            key={step.number}
            className={`h-1.5 rounded-full transition-all ${
              index === activeIndex
                ? "w-5 bg-black"
                : "w-1.5 bg-gray-300"
            }`}
          />
        ))}
      </div>

      {/* Mobile hint */}
      <p className="mt-4 text-center text-xs text-gray-400 sm:hidden">
        ← スワイプして次のステップを見る →
      </p>
    </>
  );
}
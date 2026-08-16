"use client";

import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

type HeroProps = {
  onCreateEvent: () => void;
};

export default function Hero({
  onCreateEvent,
}: HeroProps) {
  const heroPhotos = [
    "/hero/hero-phone.jpg",
    "hero-collage.png",
    // "/hero/hero-phone.jpg",
    // "hero-collage.png",
    // "/hero/hero-phone.jpg",
    // "hero-collage.png",
    // "/hero/hero-phone.jpg",
  ];

  const [heroPhotoIndex, setHeroPhotoIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroPhotoIndex((current) =>
        (current + 1) % heroPhotos.length
      );
    }, 3500);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="flex min-h-[calc(100svh-4rem)] items-center overflow-hidden px-5 py-8 sm:min-h-[calc(100svh-4rem)] sm:px-6 sm:py-5">
      <div className="mx-auto max-w-6xl">
        <div className="grid w-full items-center gap-6 lg:grid-cols-2 lg:gap-10">

          {/* =========================
              Copy
          ========================= */}
          <div className="relative z-20 text-center lg:text-left">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">
              Share memories together
            </p>

            <h1 className="text-3xl font-bold leading-[1.2] tracking-tight sm:text-5xl lg:text-6xl">
              写真を、
              <br />
              みんなで共有しよう
            </h1>

            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-gray-500 sm:text-base lg:mx-0">
              ゲストが撮った写真を、
              <br />
              QRコードひとつでかんたん共有。
            </p>

            <button
              type="button"
              onClick={onCreateEvent}
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-black px-7 py-4 text-sm font-medium text-white shadow-lg shadow-black/10 transition hover:bg-gray-800 active:scale-[0.98]"
            >
              イベントを作る
              <ArrowRight className="h-4 w-4" />
            </button>

            <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1 text-m text-green-500 lg:justify-start">
              ✓ ゲストは無料
              <br/>
              ✓ アプリ不要
            </div>
          </div>

          {/* =========================
              Visual
          ========================= */}
          <div className="relative mx-auto h-[clamp(220px,42svh,420px)] w-full max-w-lg sm:h-[480px] lg:h-[560px]">

            {/* Photo Carousel */}
            <div className="absolute inset-0">
              {heroPhotos.map((photo, index) => (
                <div
                  key={photo}
                  className={`absolute inset-0 transition-all duration-700 ${
                    index === heroPhotoIndex
                      ? "scale-100 opacity-100"
                      : "scale-105 opacity-0"
                  }`}
                >
                  <img
                    src={photo}
                    alt=""
                    className="h-full w-full object-contain"
                  />
                </div>
              ))}
            </div>

            {/* Smartphone */}
            {/* <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">

              <div className="absolute -inset-8 rounded-[4rem] bg-black/10 blur-3xl" />

              <div className="relative h-[400px] w-[200px] overflow-hidden rounded-[2.5rem] border-[8px] border-black bg-black shadow-2xl">

                <div className="relative h-full w-full overflow-hidden rounded-[2rem] bg-white">
                  <img
                    src="/hero-phone.jpg"
                    alt="ShutterChance"
                    className="h-full w-full object-contain"
                  />
                </div>

              </div>
            </div> */}

          </div>
        </div>
      </div>
    </section>
  );
}
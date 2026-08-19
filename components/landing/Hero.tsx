"use client";

import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

type HeroProps = {
  onCreateEvent: () => void;
};

export default function Hero({
  onCreateEvent,
}: HeroProps) {
  const pcHeroPhotos = [
    "/hero/pc/hero-pc-001.jpg",
    "/hero/pc/hero-pc-002.jpg",
    "/hero/pc/hero-pc-003.jpg",
    "/hero/pc/hero-pc-top.jpg",
  ];

  const mobileHeroPhotos = [
    "/hero/mobile/hero-mobile-001.jpg",
    "/hero/mobile/hero-mobile-002.jpg",
    "/hero/mobile/hero-mobile-003.jpg",
  ];

  const pcHeroPhoto = "/hero/pc/hero-pc-top.jpg"
  const mobileHeroPhoto = "/hero/pc/hero-pc-top.jpg"

  // const [heroPhotoIndex, setHeroPhotoIndex] = useState(0);

  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setHeroPhotoIndex((current) =>
  //       (current + 1) % pcHeroPhotos.length
  //     );
  //   }, 5000);

  //   return () => clearInterval(timer);
  // }, []);

  return (
    <section className="relative flex min-h-[calc(100svh-4rem)] items-center overflow-hidden px-5 py-8 sm:min-h-[calc(100svh-4rem)] sm:px-6 sm:py-5">

      {/* =========================
          Background Image
      ========================= */}

      {/* PC */}
      {/* <div className="absolute inset-0 hidden lg:block">
        {pcHeroPhotos.map((photo, index) => (
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
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div> */}

      {/* Mobile */}
      {/* <div className="absolute inset-0 block lg:hidden">
        {mobileHeroPhotos.map((photo, index) => (
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
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div> */}
      {/* PC */}
      <div className="absolute inset-0 hidden lg:block">
        <div className="absolute inset-0">
          <img
            src={pcHeroPhoto}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* Mobile */}
      <div className="absolute inset-0 block lg:hidden">
        <div className="absolute inset-0">
          <img
            src={mobileHeroPhoto}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* =========================
          Overlay
      ========================= */}
      <div className="absolute inset-0 bg-white/40" />

      {/* =========================
          Content
      ========================= */}
      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="grid w-full items-center gap-6 lg:grid-cols-2 lg:gap-10">

          {/* =========================
              Copy
          ========================= */}
          <div className="relative z-20 text-center lg:text-left">
            {/* <p className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-gray-400"> */}
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.3em]">
              Share memories together
            </p>

            <h1 className="text-3xl font-bold leading-[1.2] tracking-tight sm:text-5xl lg:text-6xl">
              写真を、
              <br />
              みんなで共有しよう
            </h1>

            {/* <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-gray-500 sm:text-base lg:mx-0"> */}
            <p className="mx-auto mt-4 max-w-md text-sm font-bold leading-7 sm:text-base lg:mx-0">
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

            <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1 text-m text-blue-800 lg:justify-start">
              ✓ ゲストは無料
              <br/>
              ✓ アプリ不要
            </div>
          </div>

          {/* =========================
              Visual Space
          ========================= */}
          <div className="relative mx-auto h-[clamp(220px,42svh,420px)] w-full max-w-lg sm:h-[480px] lg:h-[560px]" />

        </div>
      </div>
    </section>
  );
}
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

  return (
    <section className="relative flex min-h-[calc(100svh-4rem)] items-center overflow-hidden px-5 py-8 sm:min-h-[calc(100svh-4rem)] sm:px-6 sm:py-5">

      {/* =========================
          Background Image
      ========================= */}
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
              イベントで撮影した写真を、
              <br />
              QRコードひとつでかんたん共有。
              <br />
              ゲストはアプリのインストール不要。
            </p>

            <button
              type="button"
              onClick={onCreateEvent}
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-black px-7 py-4 text-sm font-medium text-white shadow-lg shadow-black/10 transition hover:bg-gray-800 active:scale-[0.98]"
            >
              イベントを作る
              <ArrowRight className="h-4 w-4" />
            </button>

            <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-blue-800 lg:justify-start">
              <span>✓ ゲストは無料</span>
              <span>✓ アプリ不要</span>
              <span>✓ 会員登録不要</span>
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
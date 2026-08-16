"use client";

import { ArrowRight } from "lucide-react";

type HeroProps = {
  onCreateEvent: () => void;
};

export default function Hero({
  onCreateEvent,
}: HeroProps) {
  return (
    <section className="overflow-hidden px-5 pb-20 pt-20 sm:px-6 sm:pb-5 sm:pt-5">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-10">

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

            <p className="mx-auto mt-6 max-w-md text-sm leading-7 text-gray-500 sm:text-base lg:mx-0">
              ゲストが撮った写真を、
              <br />
              QRコードひとつでかんたん共有。
            </p>

            <button
              type="button"
              onClick={onCreateEvent}
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-black px-7 py-4 text-sm font-medium text-white shadow-lg shadow-black/10 transition hover:bg-gray-800 active:scale-[0.98]"
            >
              イベントを作る
              <ArrowRight className="h-4 w-4" />
            </button>

            <p className="mt-4 text-xs text-gray-400">
              ゲストはアプリ不要＆無料で利用可能
            </p>
          </div>

          {/* =========================
              Visual
          ========================= */}
          <div className="relative mx-auto h-[560px] w-full max-w-lg">

            {/* Background collage */}
            <div
              className="absolute inset-0 bg-contain bg-center bg-no-repeat"
              style={{
                backgroundImage: "url('hero-collage.png')",
              }}
            />

            {/* Smartphone */}
            <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">

              {/* Smartphone shadow */}
              <div className="absolute -inset-8 rounded-[4rem] bg-black/10 blur-3xl" />

              {/* Smartphone body */}
              <div className="relative h-[400px] w-[200px] overflow-hidden rounded-[2.5rem] border-[8px] border-black bg-black shadow-2xl">

                {/* Screen */}
                <div className="relative h-full w-full overflow-hidden rounded-[2rem] bg-white">
                  <img
                    src="/hero-phone.jpg"
                    alt="ShutterChance"
                    className="h-full w-full object-contain"
                  />
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
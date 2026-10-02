"use client";

import { useEffect, useState } from "react";
import { Smartphone, X } from "lucide-react";
import IPhoneHomeScreenGuide from "@/components/event/IPhoneHomeScreenGuide";
import AndroidHomeScreenGuide from "@/components/event/AndroidHomeScreenGuide";

const STORAGE_KEY = "shutterchance-home-install-prompt-dismissed";

type DeviceType = "ios" | "android" | null;

function getDeviceType(): DeviceType {
  if (typeof navigator === "undefined") {
    return null;
  }

  const userAgent = navigator.userAgent;

  // iPhone / iPad / iPod
  if (/iPhone|iPad|iPod/i.test(userAgent)) {
    return "ios";
  }

  // Android
  if (/Android/i.test(userAgent)) {
    return "android";
  }

  return null;
}

function isStandalone(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  // iOS Safari
  const iosStandalone =
    "standalone" in window.navigator &&
    Boolean(
      (
        window.navigator as Navigator & {
          standalone?: boolean;
        }
      ).standalone,
    );

  // Android / Chrome / PWA
  const displayModeStandalone = window.matchMedia(
    "(display-mode: standalone)",
  ).matches;

  return iosStandalone || displayModeStandalone;
}

export default function AddToHomeScreenPrompt() {
  const [deviceType, setDeviceType] = useState<DeviceType>(null);

  const [isVisible, setIsVisible] = useState(false);

  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    console.log(
      "🔥 AddToHomeScreenPrompt USEEFFECT",
    );

    const device = getDeviceType();

    console.log("DEVICE CHECK", {
      device,
      userAgent: navigator.userAgent,
      platform: navigator.platform,
    });

    setDeviceType(device);

    if (!device) {
      return;
    }

    if (isStandalone()) {
      return;
    }

    const dismissed =
      localStorage.getItem(STORAGE_KEY);

    if (dismissed === "true") {
      return;
    }

    const timer = window.setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(
      STORAGE_KEY,
      "true",
    );

    setIsVisible(false);
  };

  console.log("render", {
    isVisible,
    deviceType,
  });

  if (!isVisible || !deviceType) {
    return null;
  }

  if (showGuide && deviceType === "ios") {
    return (
      <IPhoneHomeScreenGuide
        onClose={() => setShowGuide(false)}
        onComplete={handleDismiss}
      />
    );
  }

  if (showGuide && deviceType === "android") {
    return (
      <AndroidHomeScreenGuide
        onClose={() => setShowGuide(false)}
        onComplete={handleDismiss}
      />
    );
  }

  return (
    <div className="fixed inset-x-4 bottom-5 z-50 sm:left-auto sm:right-6 sm:max-w-sm">
      <div className="relative overflow-hidden rounded-2xl bg-gray-900 p-5 text-white shadow-2xl ring-1 ring-black/20">
        {/* Decorative background */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-12 -left-8 h-24 w-24 rounded-full bg-white/5" />

        {/* Close */}
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="閉じる"
          className="absolute right-3 top-3 rounded-full p-1.5 text-gray-400 transition hover:bg-white/10 hover:text-white active:scale-95"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="relative flex items-start gap-3 pr-6">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/10">
            <Smartphone className="h-5 w-5 text-white" />
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400">
              Shutter Chance
            </p>

            <h2 className="mt-1 text-base font-semibold leading-6 text-white">
              ホーム画面に追加しませんか？
            </h2>
          </div>
        </div>

        {/* Description */}
        <p className="relative mt-3 text-sm leading-6 text-gray-300">
          ホーム画面に追加すると、
          次回からこのイベントをすぐに開けます。
        </p>

        {/* iPhone */}
        {deviceType === "ios" && (
          <div className="relative mt-4 rounded-xl bg-white/10 px-4 py-3.5 ring-1 ring-white/10">
            <p className="text-sm font-semibold text-white">
              iPhoneの場合
            </p>

            <p className="mt-1.5 text-sm leading-6 text-gray-300">
              Safariの「共有」から
              「ホーム画面に追加」を選択してください。
            </p>
          </div>
        )}

        {/* Android */}
        {deviceType === "android" && (
          <div className="relative mt-4 rounded-xl bg-white/10 px-4 py-3.5 ring-1 ring-white/10">
            <p className="text-sm font-semibold text-white">
              Androidの場合
            </p>

            <p className="mt-1.5 text-sm leading-6 text-gray-300">
              ブラウザのメニューから
              「ホーム画面に追加」を選択してください。
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="relative mt-4 flex gap-2">
          <button
            type="button"
            onClick={handleDismiss}
            className="flex-1 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-white/10 hover:text-white active:scale-[0.98]"
          >
            あとで
          </button>

          <button
            type="button"
            onClick={() => setShowGuide(true)}
            className="flex-1 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-gray-100 active:scale-[0.98]"
          >
            追加方法を見る
          </button>
        </div>
      </div>
    </div>
  );
}
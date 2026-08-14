"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import BackToHomeButton from "@/components/common/BackToHomeButton";

function AuthPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectTo = searchParams.get("redirectTo");

  const createAuthUrl = (path: string) => {
    if (!redirectTo) {
      return path;
    }

    return `${path}?redirectTo=${encodeURIComponent(redirectTo)}`;
  };

  return (
    <main className="relative min-h-screen bg-white px-6">
      {/* Back to Home */}
      <div className="absolute left-6 top-6 sm:left-8 sm:top-8">
        <BackToHomeButton />
      </div>

      {/* Auth Content */}
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md text-center">
          <h1 className="text-3xl font-semibold uppercase tracking-[0.25em]">
            Shutter Chance
          </h1>

          <p className="mt-3 text-sm text-gray-500">
            写真を、みんなで共有しよう
          </p>

          <div className="mt-10 space-y-3">
            <button
              type="button"
              onClick={() =>
                router.push(createAuthUrl("/login"))
              }
              className="w-full rounded-xl bg-black px-4 py-4 font-medium text-white transition hover:bg-gray-800"
            >
              ログイン
            </button>

            <button
              type="button"
              onClick={() =>
                router.push(createAuthUrl("/signup"))
              }
              className="w-full rounded-xl border border-gray-300 px-4 py-4 font-medium transition hover:bg-gray-50"
            >
              新しく始める
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-white">
          <p className="text-sm text-gray-500">
            読み込み中...
          </p>
        </main>
      }
    >
      <AuthPageContent />
    </Suspense>
  );
}
"use client";

import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { supabase } from "@/lib/supabase/client";
import BackToHomeButton from "@/components/common/BackToHomeButton";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectTo =
    searchParams.get("redirectTo") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // メール確認が必要な設定の場合
    if (data.user && !data.session) {
      setSuccess(true);
      setLoading(false);
      return;
    }

    // メール確認が不要な場合
    router.push(redirectTo);
  }

  const handleLogin = () => {
    const loginUrl = searchParams.get("redirectTo");

    if (loginUrl) {
      router.push(
        `/login?redirectTo=${encodeURIComponent(loginUrl)}`
      );
    } else {
      router.push("/login");
    }
  };

  if (success) {
    return (
      <main className="relative min-h-screen bg-white px-6">
        {/* Back to Home */}
        <div className="absolute left-6 top-6 sm:left-8 sm:top-8">
          <BackToHomeButton />
        </div>

        {/* Success Content */}
        <div className="flex min-h-screen items-center justify-center">
          <div className="w-full max-w-md text-center">
            <h1 className="text-3xl font-semibold uppercase tracking-[0.25em]">
              Shutter Chance
            </h1>

            <div className="mt-10">
              <h2 className="text-xl font-semibold">
                確認メールを送信しました
              </h2>

              <p className="mt-4 text-sm leading-6 text-gray-500">
                {email} に確認メールを送信しました。
                <br />
                メール内のリンクをクリックして、
                <br />
                アカウントを有効にしてください。
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogin}
              className="mt-8 w-full rounded-xl bg-black px-4 py-3 font-medium text-white transition hover:bg-gray-800"
            >
              ログイン画面へ
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-white px-6">
      {/* Back to Home */}
      <div className="absolute left-6 top-6 sm:left-8 sm:top-8">
        <BackToHomeButton />
      </div>

      {/* Signup Content */}
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-semibold uppercase tracking-[0.25em]">
              Shutter Chance
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              イベント主催者アカウントを作成
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium"
              >
                メールアドレス
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="example@example.com"
                required
                autoComplete="email"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium"
              >
                パスワード
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="8文字以上"
                required
                minLength={8}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
              />
            </div>

            {error && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-black px-4 py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "登録中..." : "アカウントを作成"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            すでにアカウントをお持ちですか？
            <button
              type="button"
              onClick={handleLogin}
              className="ml-1 font-medium text-black underline underline-offset-4"
            >
              ログイン
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}

export default function SignupPage() {
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
      <SignupForm />
    </Suspense>
  );
}
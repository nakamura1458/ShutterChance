"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  LockKeyhole,
} from "lucide-react";

import { supabase } from "@/lib/supabase/client";
import BackToHomeButton from "@/components/common/BackToHomeButton";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] =
    useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) {
        return;
      }

      if (!session) {
        setError(
          "パスワード再設定用のリンクが無効、または期限切れです。"
        );
      }

      setCheckingSession(false);
    }

    checkSession();

    return () => {
      mounted = false;
    };
  }, []);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (password.length < 8) {
      setError(
        "新しいパスワードは8文字以上で入力してください。"
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        "新しいパスワードと確認用パスワードが一致しません。"
      );
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      console.error(error);

      setError(
        "パスワードの変更に失敗しました。もう一度お試しください。"
      );

      setLoading(false);
      return;
    }

    setSuccess(true);
    setPassword("");
    setConfirmPassword("");
    setLoading(false);
  }

  /*
   * =========================
   * Checking session
   * =========================
   */
  if (checkingSession) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto flex min-h-screen max-w-md items-center px-6">
          <div className="w-full text-center">
            <p className="text-sm text-gray-500">
              確認しています...
            </p>
          </div>
        </div>
      </main>
    );
  }

  /*
   * =========================
   * Success
   * =========================
   */
  if (success) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto flex min-h-screen max-w-md items-center px-6 py-10">
          <div className="w-full">
            <BackToHomeButton />

            <div className="mt-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                <CheckCircle2 className="h-7 w-7" />
              </div>

              <h1 className="mt-6 text-2xl font-semibold">
                パスワードを変更しました
              </h1>

              <p className="mt-4 text-sm leading-7 text-gray-500">
                新しいパスワードが設定されました。
                <br />
                新しいパスワードでログインできます。
              </p>

              <button
                type="button"
                onClick={() => router.push("/login")}
                className="mt-8 w-full rounded-xl bg-black px-4 py-3.5 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                ログイン画面へ
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /*
   * =========================
   * Invalid / expired link
   * =========================
   */
  if (error && !loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto flex min-h-screen max-w-md items-center px-6 py-10">
          <div className="w-full">
            <BackToHomeButton />

            <div className="mt-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
                <LockKeyhole className="h-6 w-6 text-red-500" />
              </div>

              <h1 className="mt-6 text-2xl font-semibold">
                パスワードを再設定できません
              </h1>

              <p className="mt-4 text-sm leading-7 text-gray-500">
                {error}
              </p>

              <p className="mt-4 text-xs leading-6 text-gray-400">
                もう一度パスワードリセットを
                <br />
                お試しください。
              </p>

              <button
                type="button"
                onClick={() =>
                  router.push("/forgot-password")
                }
                className="mt-8 w-full rounded-xl bg-black px-4 py-3.5 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                パスワードリセットをやり直す
              </button>

              <button
                type="button"
                onClick={() => router.push("/login")}
                className="mt-4 inline-flex items-center gap-1.5 text-sm text-gray-500 underline underline-offset-4 transition hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4" />
                ログイン画面に戻る
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /*
   * =========================
   * Reset password form
   * =========================
   */
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto flex min-h-screen max-w-md items-center px-6 py-10">
        <div className="w-full">
          <BackToHomeButton />

          <div className="mt-10 text-center">
            <h1 className="text-3xl font-semibold uppercase tracking-[0.2em]">
              Shutter Chance
            </h1>

            <p className="mt-3 text-sm text-gray-500">
              パスワードを再設定
            </p>
          </div>

          <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-6">
            <div className="mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50">
                <LockKeyhole className="h-5 w-5 text-gray-600" />
              </div>

              <h2 className="mt-4 text-base font-semibold">
                新しいパスワードを設定
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                新しく使用するパスワードを
                <br />
                設定してください。
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* New Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium"
                >
                  新しいパスワード
                </label>

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError("");
                  }}
                  placeholder="8文字以上"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
                />

                <p className="mt-2 text-xs text-gray-400">
                  8文字以上で入力してください。
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium"
                >
                  新しいパスワード（確認）
                </label>

                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => {
                    setConfirmPassword(event.target.value);
                    setError("");
                  }}
                  placeholder="もう一度入力してください"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
                />
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-xl bg-red-50 px-4 py-3 text-sm leading-6 text-red-600">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-black px-4 py-3.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "変更しています..."
                  : "パスワードを変更"}
              </button>
            </form>
          </div>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 underline underline-offset-4 transition hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              ログイン画面に戻る
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  CheckCircle2,
} from "lucide-react";

import { supabase } from "@/lib/supabase/client";
import BackToHomeButton from "@/components/common/BackToHomeButton";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    const redirectTo = `${window.location.origin}/reset-password`;

    const { error } =
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });

    if (error) {
      console.error(error);

      setError(
        "パスワードリセットメールの送信に失敗しました。もう一度お試しください。"
      );

      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

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
                リセットメールを送信しました
              </h1>

              <p className="mt-4 text-sm leading-7 text-gray-500">
                {email} に
                <br />
                パスワード再設定用のメールを送信しました。
              </p>

              <p className="mt-5 text-xs leading-6 text-gray-400">
                メールに記載されているリンクを開いて、
                <br />
                新しいパスワードを設定してください。
              </p>

              <button
                type="button"
                onClick={() => router.push("/login")}
                className="mt-8 w-full rounded-xl bg-black px-4 py-3.5 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                ログイン画面へ戻る
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto flex min-h-screen max-w-md items-center px-6 py-10">
        <div className="w-full">
          <BackToHomeButton />

          <div className="mt-10">
            <div className="text-center">
              <h1 className="text-3xl font-semibold uppercase tracking-[0.2em]">
                Shutter Chance
              </h1>

              <p className="mt-3 text-sm text-gray-500">
                パスワードをリセット
              </p>
            </div>

            <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-6">
              <div className="mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50">
                  <Mail className="h-5 w-5 text-gray-600" />
                </div>

                <h2 className="mt-4 text-base font-semibold">
                  メールアドレスを入力してください
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  パスワード再設定用のリンクを
                  <br />
                  メールでお送りします。
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >
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
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setError("");
                    }}
                    placeholder="example@example.com"
                    autoComplete="email"
                    required
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
                  />
                </div>

                {error && (
                  <div className="rounded-xl bg-red-50 px-4 py-3 text-sm leading-6 text-red-600">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-black px-4 py-3.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading
                    ? "送信しています..."
                    : "リセットメールを送る"}
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
      </div>
    </main>
  );
}
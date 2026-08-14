"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  LockKeyhole,
} from "lucide-react";

import { supabase } from "@/lib/supabase/client";
import BackToHomeButton from "@/components/common/BackToHomeButton";

export default function PasswordPage() {
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleChangePassword(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess(false);

    // パスワード確認
    if (newPassword.length < 8) {
      setError("新しいパスワードは8文字以上で入力してください。");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("新しいパスワードと確認用パスワードが一致しません。");
      return;
    }

    if (currentPassword === newPassword) {
      setError(
        "新しいパスワードは現在のパスワードと別のものを設定してください。"
      );
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
      current_password: currentPassword,
    });

    if (error) {
      console.error(error);

      if (
        error.message.toLowerCase().includes("current password")
      ) {
        setError("現在のパスワードが正しくありません。");
      } else {
        setError(
          "パスワードの変更に失敗しました。もう一度お試しください。"
        );
      }

      setLoading(false);
      return;
    }

    setSuccess(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl px-5 py-8 sm:px-6 sm:py-10">
        {/* =========================
            Header
        ========================= */}
        <header>

          <button
            type="button"
            onClick={() => router.push("/account")}
            className="mt-5 inline-flex items-center gap-1.5 text-sm text-gray-500 transition hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            アカウント設定
          </button>

          <div className="mt-6">
            <h1 className="text-3xl font-semibold uppercase tracking-[0.2em]">
              Shutter Chance
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              パスワード変更
            </p>
          </div>
        </header>

        {/* =========================
            Form
        ========================= */}
        <section className="mt-10">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <div className="border-b border-gray-100 px-6 py-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50">
                  <LockKeyhole className="h-5 w-5 text-gray-600" />
                </div>

                <div>
                  <h2 className="text-sm font-semibold">
                    パスワードを変更
                  </h2>

                  <p className="mt-1 text-xs text-gray-400">
                    新しいパスワードを設定してください。
                  </p>
                </div>
              </div>
            </div>

            <form
              onSubmit={handleChangePassword}
              className="space-y-5 px-6 py-6"
            >
              {/* Current Password */}
              <div>
                <label
                  htmlFor="currentPassword"
                  className="mb-2 block text-sm font-medium"
                >
                  現在のパスワード
                </label>

                <input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(event) =>
                    setCurrentPassword(event.target.value)
                  }
                  placeholder="現在のパスワード"
                  autoComplete="current-password"
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
                />
              </div>

              {/* New Password */}
              <div>
                <label
                  htmlFor="newPassword"
                  className="mb-2 block text-sm font-medium"
                >
                  新しいパスワード
                </label>

                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(event) =>
                    setNewPassword(event.target.value)
                  }
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
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
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

              {/* Success */}
              {success && (
                <div className="flex items-start gap-3 rounded-xl bg-gray-50 px-4 py-3 text-sm leading-6 text-gray-700">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />

                  <div>
                    <p className="font-medium">
                      パスワードを変更しました。
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      新しいパスワードでログインできます。
                    </p>
                  </div>
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
        </section>

        {/* =========================
            Back
        ========================= */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => router.push("/account")}
            className="text-sm text-gray-500 underline underline-offset-4 transition hover:text-gray-900"
          >
            アカウント設定に戻る
          </button>
        </div>
      </div>
    </main>
  );
}
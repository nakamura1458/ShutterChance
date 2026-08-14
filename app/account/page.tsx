import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronRight,
  LockKeyhole,
  LogOut,
  Mail,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import BackToHomeButton from "@/components/common/BackToHomeButton";

export default async function AccountPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 未ログインの場合
  if (!user) {
    redirect("/auth");
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl px-5 py-8 sm:px-6 sm:py-10">
        {/* =========================
            Header
        ========================= */}
        <header>
          <BackToHomeButton />

          <div className="mt-6">
            <h1 className="text-3xl font-semibold uppercase tracking-[0.2em]">
              Shutter Chance
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              アカウント設定
            </p>
          </div>
        </header>

        {/* =========================
            Account Information
        ========================= */}
        <section className="mt-10">
          <h2 className="mb-3 px-1 text-sm font-semibold text-gray-500">
            アカウント情報
          </h2>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            {/* Email */}
            <div className="flex items-center gap-4 px-5 py-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-50">
                <Mail className="h-5 w-5 text-gray-600" />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-gray-400">
                  メールアドレス
                </p>

                <p className="mt-1 truncate text-sm font-medium text-gray-900">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            Security
        ========================= */}
        <section className="mt-8">
          <h2 className="mb-3 px-1 text-sm font-semibold text-gray-500">
            セキュリティ
          </h2>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <Link
              href="/account/password"
              className="flex items-center gap-4 px-5 py-5 transition hover:bg-gray-50"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-50">
                <LockKeyhole className="h-5 w-5 text-gray-600" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  パスワード
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  パスワードを変更できます
                </p>
              </div>

              <ChevronRight className="h-5 w-5 shrink-0 text-gray-400" />
            </Link>
          </div>
        </section>

        {/* =========================
            Account
        ========================= */}
        <section className="mt-8">
          <h2 className="mb-3 px-1 text-sm font-semibold text-gray-500">
            アカウント
          </h2>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            {/* Dashboard */}
            <Link
              href="/dashboard"
              className="flex items-center gap-4 px-5 py-5 transition hover:bg-gray-50"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-50">
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  ダッシュボード
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  イベントの管理画面へ戻ります
                </p>
              </div>

              <ChevronRight className="h-5 w-5 shrink-0 text-gray-400" />
            </Link>

            <div className="border-t border-gray-100" />

            {/* Logout */}
            <form
              action={async () => {
                "use server";

                const supabase = await createClient();

                await supabase.auth.signOut();

                redirect("/auth");
              }}
            >
              <button
                type="submit"
                className="flex w-full items-center gap-4 px-5 py-5 text-left transition hover:bg-gray-50"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-50">
                  <LogOut className="h-5 w-5 text-gray-600" />
                </div>

                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    ログアウト
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    アカウントからログアウトします
                  </p>
                </div>
              </button>
            </form>
          </div>
        </section>

        {/* =========================
            Footer
        ========================= */}
        <footer className="mt-10 border-t border-gray-200 pt-6">
          <p className="text-center text-xs text-gray-400 font-semibold uppercase tracking-[0.2em]">
            Shutter Chancex
          </p>
        </footer>
      </div>
    </main>
  );
}
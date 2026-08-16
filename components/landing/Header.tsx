"use client";

import { useEffect, useState } from "react";
import {
  CircleUserRound,
  Menu,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase/client";

type HeaderProps = {
  onCreateEvent: () => void;
};

export default function Header({
  onCreateEvent,
}: HeaderProps) {
  
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);

  // =========================
  // Auth
  // =========================
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
      setAuthLoading(false);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // =========================
  // Navigation
  // =========================
  const handleLogin = () => {
    router.push("/login");
  };

  const handleDashboard = () => {
    router.push("/dashboard");
  };

  const handleAccount = () => {
    router.push("/account");
  };

  const handleLogoClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {/* =========================
          Header
      ========================= */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-6">

          {/* Logo */}
          <button
            type="button"
            onClick={handleLogoClick}
            className="text-lg font-bold uppercase tracking-[0.3em]"
          >
            Shutter Chance
          </button>

          {/* =========================
              Desktop Navigation
          ========================= */}
          <div className="hidden items-center gap-6 sm:flex">
            {/* Page Navigation */}
            <nav className="flex items-center gap-6">
              <a
                href="#how-it-works"
                className="text-sm font-medium text-gray-600 transition hover:text-black"
              >
                使い方
              </a>

              <a
                href="#pricing"
                className="text-sm font-medium text-gray-600 transition hover:text-black"
              >
                料金プラン
              </a>

              <a
                href="#faq"
                className="text-sm font-medium text-gray-600 transition hover:text-black"
              >
                よくある質問
              </a>
            </nav>

            {/* Auth */}
            {authLoading ? (
              <div className="h-9 w-32 animate-pulse rounded-full bg-gray-100" />
            ) : user ? (
              <>
                {/* Dashboard */}
                <button
                  type="button"
                  onClick={handleDashboard}
                  className="rounded-full border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 active:scale-[0.98]"
                >
                  イベント管理
                </button>

                {/* Account */}
                <button
                  type="button"
                  onClick={handleAccount}
                  aria-label="アカウント設定"
                  title="アカウント設定"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-700 transition hover:bg-gray-50 active:scale-[0.95]"
                >
                  <CircleUserRound className="h-5 w-5" />
                </button>
              </>
            ) : (
              <>
                {/* Login */}
                <button
                  type="button"
                  onClick={handleLogin}
                  className="rounded-full px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  ログイン
                </button>

                {/* Create Event */}
                <button
                  type="button"
                  onClick={onCreateEvent}
                  className="rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 active:scale-[0.98]"
                >
                  イベントを作る
                </button>
              </>
            )}
          </div>

          {/* =========================
              Mobile Menu Button
          ========================= */}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="rounded-full p-2 transition hover:bg-gray-100 sm:hidden"
            aria-label="メニューを開く"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* =========================
          Mobile Menu
      ========================= */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100] bg-white sm:hidden">

          {/* Mobile Menu Header */}
          <div className="flex h-16 items-center justify-between border-b border-gray-100 px-5">
            <span className="text-lg font-bold uppercase tracking-[0.3em]">
              Shutter Chance
            </span>

            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="rounded-full p-2 hover:bg-gray-100"
              aria-label="メニューを閉じる"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile Menu Contents */}
          <div className="px-5 py-8">
            {authLoading ? (
              <div className="h-12 w-full animate-pulse rounded-xl bg-gray-100" />
            ) : user ? (
              <div className="space-y-3">
                {/* Page Navigation */}
                <a
                  href="#how-it-works"
                  onClick={() => setMenuOpen(false)}
                  className="block w-full rounded-xl border border-gray-200 px-4 py-4 font-medium"
                >
                  使い方
                </a>

                <a
                  href="#pricing"
                  onClick={() => setMenuOpen(false)}
                  className="block w-full rounded-xl border border-gray-200 px-4 py-4 font-medium"
                >
                  料金プラン
                </a>

                <a
                  href="#faq"
                  onClick={() => setMenuOpen(false)}
                  className="block w-full rounded-xl border border-gray-200 px-4 py-4 font-medium"
                >
                  よくある質問
                </a>

                <div className="my-5 border-t border-gray-100" />

                {/* Event Management */}
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    handleDashboard();
                  }}
                  className="w-full rounded-xl bg-black px-4 py-4 text-left font-medium text-white"
                >
                  イベント管理
                </button>

                {/* Account */}
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    handleAccount();
                  }}
                  className="flex w-full items-center gap-3 rounded-xl border border-gray-200 px-4 py-4 text-left font-medium"
                >
                  <CircleUserRound className="h-5 w-5" />

                  <span>
                    アカウント設定
                  </span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Page Navigation */}
                <a
                  href="#how-it-works"
                  onClick={() => setMenuOpen(false)}
                  className="block w-full rounded-xl border border-gray-200 px-4 py-4 font-medium"
                >
                  使い方
                </a>

                <a
                  href="#pricing"
                  onClick={() => setMenuOpen(false)}
                  className="block w-full rounded-xl border border-gray-200 px-4 py-4 font-medium"
                >
                  料金プラン
                </a>

                <a
                  href="#faq"
                  onClick={() => setMenuOpen(false)}
                  className="block w-full rounded-xl border border-gray-200 px-4 py-4 font-medium"
                >
                  よくある質問
                </a>

                <div className="my-5 border-t border-gray-100" />

                {/* Login */}
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogin();
                  }}
                  className="w-full rounded-xl border border-gray-200 px-4 py-4 text-left font-medium"
                >
                  ログイン
                </button>

                {/* Create Event */}
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onCreateEvent();
                  }}
                  className="w-full rounded-xl bg-black px-4 py-4 font-medium text-white"
                >
                  イベントを作る
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
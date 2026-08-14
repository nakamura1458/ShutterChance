"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  Camera,
  Cloud,
  Images,
  Menu,
  QrCode,
  Users,
  X,
  Check,
  CircleUserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { checkEventToken } from "@/actions/event.actions";
import { supabase } from "@/lib/supabase/client";

export default function Home() {
  const router = useRouter();

  const [eventToken, setEventToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
  // Guest Event
  // =========================
  const handleEnterEvent = async () => {
    const token = eventToken.trim();

    if (!token) {
      setError("イベントコードを入力してください");
      return;
    }

    setError("");
    setLoading(true);

    const result = await checkEventToken(token);

    if (!result.success) {
      setError(result.message);
      setLoading(false);
      return;
    }

    router.push(`/e/${result.eventToken}`);
  };

  // =========================
  // Navigation
  // =========================
  const handleCreateEvent = () => {
    router.push("/dashboard/events/new");
  };

  const handleLogin = () => {
    router.push("/login");
  };

  const handleSignup = () => {
    router.push("/signup");
  };

  const handleDashboard = () => {
    router.push("/dashboard");
  };

  const handleAccount = () => {
    router.push("/account");
  };

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* =========================
          Header
      ========================= */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-6">
          {/* Logo */}
          <button
            type="button"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
            className="text-lg font-bold uppercase tracking-[0.3em]"
          >
            Shutter Chance
          </button>

          {/* =========================
              Desktop Navigation
          ========================= */}
          <div className="hidden items-center gap-3 sm:flex">
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
                  ダッシュボード
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

                {/* Signup */}
                <button
                  type="button"
                  onClick={handleSignup}
                  className="rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 active:scale-[0.98]"
                >
                  会員登録
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
                {/* Dashboard */}
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    handleDashboard();
                  }}
                  className="w-full rounded-xl border border-gray-200 px-4 py-4 text-left font-medium"
                >
                  ダッシュボード
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
                    アカウント
                  </span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
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

                {/* Signup */}
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    handleSignup();
                  }}
                  className="w-full rounded-xl bg-black px-4 py-4 font-medium text-white"
                >
                  会員登録
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================
          Hero
      ========================= */}
      <section className="overflow-hidden px-5 pb-20 pt-20 sm:px-6 sm:pb-28 sm:pt-28">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
            {/* Copy */}
            <div className="text-center lg:text-left">
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">
                Share memories together
              </p>

              <h1 className="text-4xl font-bold leading-[1.2] tracking-tight sm:text-5xl lg:text-6xl">
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
                onClick={handleCreateEvent}
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-black px-7 py-4 text-sm font-medium text-white shadow-lg shadow-black/10 transition hover:bg-gray-800 active:scale-[0.98]"
              >
                イベントを作る
                <ArrowRight className="h-4 w-4" />
              </button>

              <p className="mt-4 text-xs text-gray-400">
                ゲストはアプリ不要＆無料で利用可能
              </p>
            </div>

            {/* Photo Mockup */}
            <div className="relative mx-auto w-full max-w-md lg:max-w-lg">
              <div className="absolute -inset-8 rounded-[3rem] bg-gray-50 blur-3xl" />

              <img
                src="/images/hero-phone.png"
                alt="ShutterChance"
                className="relative w-full"
              />

              <div className="absolute -bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white px-5 py-3 text-xs font-medium shadow-xl shadow-black/10">
                <Users className="h-4 w-4" />
                みんなの写真が集まる
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          Problem
      ========================= */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">
            Problem
          </p>

          <h2 className="mt-4 text-2xl font-bold sm:text-3xl">
            こんな経験ありませんか？
          </h2>

          <p className="mt-6 text-lg font-medium text-gray-700">
            「あとで写真送って！」
          </p>

          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            <ProblemCard text="写真がバラバラになる" />
            <ProblemCard text="LINEで一枚ずつ送ってもらう" />
            <ProblemCard text="なかなか写真が集まらない" />
            <ProblemCard text="アプリを入れてもらえない" />
          </div>
        </div>
      </section>

      {/* =========================
          Solution
      ========================= */}
      <section className="px-5 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">
              Shutter Chance
            </p>

            <h2 className="mt-4 text-2xl font-bold uppercase sm:text-3xl">
              Shutter Chance なら
            </h2>

            <p className="mt-5 text-xl font-medium sm:text-2xl">
              みんなの写真が、
              <br />
              <span className="text-gray-400">
                ひとつの場所に。
              </span>
            </p>
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-3">
            <FeatureCard
              icon={<QrCode className="h-6 w-6" />}
              title="QRコードで参加"
              description="ゲストはQRコードを読み込むだけ。"
            />

            <FeatureCard
              icon={<Camera className="h-6 w-6" />}
              title="写真を撮る"
              description="スマホからそのまま写真を共有。"
            />

            <FeatureCard
              icon={<Cloud className="h-6 w-6" />}
              title="みんなで見る"
              description="集まった写真をみんなで楽しめます。"
            />
          </div>
        </div>
      </section>

      {/* =========================
          How it works
      ========================= */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">
              How it works
            </p>

            <h2 className="mt-4 text-2xl font-bold sm:text-3xl">
              使い方はかんたん
            </h2>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-4">
            <Step number="01" title="イベントを作る" />
            <Step number="02" title="QRコードを共有" />
            <Step number="03" title="写真を撮る" />
            <Step number="04" title="みんなで見る" />
          </div>
        </div>
      </section>

      {/* =========================
          Product Preview
      ========================= */}
      <section className="overflow-hidden px-5 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">
              Product
            </p>

            <h2 className="mt-4 text-2xl font-bold sm:text-3xl">
              実際の{" "}
              <span className="uppercase">
                Shutter Chance
              </span>
            </h2>

            <p className="mt-5 text-sm leading-7 text-gray-500">
              撮った写真をその場で共有。
              <br />
              集まった写真をみんなで楽しめます。
            </p>
          </div>

          <div className="mt-14 flex justify-center gap-5">
            <PhoneMockup title="写真を撮る" />
            <PhoneMockup title="みんなの写真" />
            <PhoneMockup title="写真を見る" />
          </div>
        </div>
      </section>

      {/* =========================
          Pricing
      ========================= */}
      <section
        id="pricing"
        className="border-t border-gray-100 bg-gray-50 px-5 py-20 sm:px-6 sm:py-28"
      >
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">
            Simple pricing
          </p>

          <h2 className="mt-4 text-2xl font-bold sm:text-3xl">
            主催者だけが支払う
          </h2>

          <p className="mt-5 text-sm leading-7 text-gray-500">
            ゲストは無料。
            <br />
            アプリのインストールも必要ありません。
          </p>

          <div className="mx-auto mt-10 max-w-sm rounded-3xl bg-white p-7 text-left shadow-sm ring-1 ring-gray-100">
            <div className="space-y-4">
              <PriceFeature text="ゲストは無料" />
              <PriceFeature text="アプリのインストール不要" />
              <PriceFeature text="QRコードでかんたん参加" />
              <PriceFeature text="みんなの写真をまとめて管理" />
            </div>

            <button
              type="button"
              onClick={() => router.push("/plan")}
              className="mt-7 w-full rounded-full border border-gray-300 px-5 py-3.5 text-sm font-medium transition hover:bg-gray-50"
            >
              料金プランを見る
            </button>
          </div>
        </div>
      </section>

      {/* =========================
          Guest Entry
      ========================= */}
      <section className="px-5 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-md rounded-3xl bg-gray-50 p-7 text-center sm:p-9">
          <Images className="mx-auto h-6 w-6" />

          <h2 className="mt-4 text-lg font-bold">
            ゲストの方はこちら
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            イベントコードを入力して参加できます。
          </p>

          <div className="mt-6">
            <input
              type="text"
              value={eventToken}
              onChange={(e) => {
                setEventToken(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleEnterEvent();
                }
              }}
              placeholder="イベントコード"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-center text-base tracking-wider outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
            />

            {error && (
              <p className="mt-2 text-left text-sm text-red-500">
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={handleEnterEvent}
              disabled={!eventToken.trim() || loading}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-black px-4 py-3.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? "確認中..." : "イベントを見る"}

              {!loading && (
                <ArrowRight className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </section>

      {/* =========================
          Final CTA
      ========================= */}
      <section className="bg-black px-5 py-24 text-center text-white sm:px-6 sm:py-32">
        <div className="mx-auto max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
            Shutter Chance
          </p>

          <h2 className="mt-6 text-3xl font-bold leading-tight sm:text-4xl">
            思い出を、
            <br />
            みんなの写真で残そう。
          </h2>

          <p className="mt-6 text-sm leading-7 text-gray-400">
            結婚式の一日を、
            <br />
            みんなが撮った写真と一緒に。
          </p>

          <button
            type="button"
            onClick={handleCreateEvent}
            className="mt-9 inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-medium text-black transition hover:bg-gray-100 active:scale-[0.98]"
          >
            イベントを作る
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* =========================
          Footer
      ========================= */}
      <footer className="bg-black px-5 pb-8 text-white sm:px-6">
        <div className="mx-auto max-w-6xl border-t border-white/10 pt-7">
          <div className="flex flex-col items-center justify-between gap-5 sm:flex-row">
            <p className="text-sm font-semibold uppercase tracking-[0.2em]">
              Shutter Chance
            </p>

            <div className="flex items-center gap-4 text-xs text-gray-500">
              <button
                type="button"
                className="transition hover:text-white"
              >
                利用規約
              </button>

              <span>・</span>

              <button
                type="button"
                className="transition hover:text-white"
              >
                プライバシーポリシー
              </button>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-gray-600 sm:text-left">
            © 2026 ShutterChance
          </p>
        </div>
      </footer>
    </main>
  );
}

/* =========================
   Components
========================= */

function ProblemCard({ text }: { text: string }) {
  return (
    <div className="rounded-2xl bg-white px-5 py-5 text-left shadow-sm">
      <p className="text-sm text-gray-600">
        {text}
      </p>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-7 text-center shadow-sm">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50">
        {icon}
      </div>

      <h3 className="mt-5 text-sm font-bold">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-6 text-gray-500">
        {description}
      </p>
    </div>
  );
}

function Step({
  number,
  title,
}: {
  number: string;
  title: string;
}) {
  return (
    <div className="relative text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-sm font-bold shadow-sm ring-1 ring-gray-100">
        {number}
      </div>

      <h3 className="mt-5 text-sm font-bold">
        {title}
      </h3>
    </div>
  );
}

function PhoneMockup({ title }: { title: string }) {
  return (
    <div className="hidden w-48 shrink-0 rounded-[2rem] border-[6px] border-gray-900 bg-white p-2 shadow-xl first:block sm:block">
      <div className="overflow-hidden rounded-[1.5rem] bg-gray-50">
        <div className="flex h-8 items-center justify-center">
          <div className="h-1 w-12 rounded-full bg-gray-300" />
        </div>

        <div className="aspect-[9/16] bg-gray-100">
          <div className="grid grid-cols-2 gap-1 p-2 pt-5">
            <div className="aspect-square rounded-lg bg-gray-200" />
            <div className="aspect-square rounded-lg bg-gray-300" />
            <div className="aspect-square rounded-lg bg-gray-300" />
            <div className="aspect-square rounded-lg bg-gray-200" />
            <div className="aspect-square rounded-lg bg-gray-300" />
            <div className="aspect-square rounded-lg bg-gray-200" />
          </div>
        </div>

        <div className="px-3 py-3">
          <p className="text-center text-[10px] font-medium">
            {title}
          </p>
        </div>
      </div>
    </div>
  );
}

function PriceFeature({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-black">
        <Check className="h-3 w-3 text-white" />
      </div>

      <p className="text-sm text-gray-600">
        {text}
      </p>
    </div>
  );
}
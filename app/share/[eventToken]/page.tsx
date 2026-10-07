import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

import QRCodeDisplay from "@/components/share/QRCodeDisplay";
import ReceptionImageGenerator from "@/components/share/ReceptionImageGenerator";
import ShareSection from "@/components/share/ShareSection";

type Props = {
  params: Promise<{
    eventToken: string;
  }>;
};

export default async function SharePage({
  params,
}: Props) {
  const { eventToken } = await params;

  if (!eventToken) {
    notFound();
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!appUrl) {
    throw new Error(
      "NEXT_PUBLIC_APP_URL is not configured.",
    );
  }

  const guestUrl = `${appUrl}/e/${eventToken}`;

  return (
    <main className="min-h-screen bg-zinc-50">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-zinc-200/80 bg-zinc-50/90 backdrop-blur">
        <div className="mx-auto flex h-15 max-w-md items-center px-4">
          <Link
            href={`/e/${eventToken}`}
            className="flex items-center gap-1.5 text-sm font-medium text-zinc-700 transition-colors hover:text-zinc-950"
          >
            <ArrowLeft className="h-4 w-4" />
            イベントに戻る
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-md px-4 pb-16">
        {/* ページヘッダー */}
        <div className="py-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-zinc-400">
            Shutter Chance
          </p>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-950">
            このイベントをシェア
          </h1>

          <p className="mt-3 text-sm leading-6 text-zinc-500">
            友だちやゲストに共有して、
            <br />
            みんなで写真を集めましょう。
          </p>
        </div>

        {/* イベントを共有 */}
        <ShareSection guestUrl={guestUrl} />

        {/* ゲスト用QRカード */}
        <QRCodeDisplay guestUrl={guestUrl} />

        {/* 卓上用画像 */}
        <ReceptionImageGenerator
          guestUrl={guestUrl}
        />
      </div>
    </main>
  );
}
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import QRCodeDisplay from "@/components/share/QRCodeDisplay";

type Props = {
  params: Promise<{
    eventToken: string;
  }>;
};

export default async function SharePage({ params }: Props) {
  const { eventToken } = await params;

  if (!eventToken) {
    notFound();
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!appUrl) {
    throw new Error("NEXT_PUBLIC_APP_URL is not configured.");
  }

  const guestUrl = `${appUrl}/e/${eventToken}`;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-md">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gray-400">
            ShutterChance
          </p>

          <h1 className="mt-4 text-3xl font-bold tracking-tight">
            このイベントをシェア
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            友だちやゲストに共有して、
            <br />
            みんなで写真を集めましょう。
          </p>
        </div>

        <QRCodeDisplay guestUrl={guestUrl} />
      </div>
    </main>
  );
}
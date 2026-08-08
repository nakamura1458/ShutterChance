import { notFound } from "next/navigation";
import QRCodeDisplay from "@/components/share/QRCodeDisplay";

type Props = {
  params: Promise<{
    eventToken: string;
  }>;
};

export default async function AdminPage({ params }: Props) {
  const { eventToken } = await params;

  if (!eventToken) {
    notFound();
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!appUrl) {
    throw new Error("NEXT_PUBLIC_APP_URL is not configured.");
  }

  const guestUrl = `${appUrl}/e/${eventToken}`;
  // const guestUrl = `http://localhost:3000/e/${eventToken}`;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-md">
        <h1 className="text-2xl font-bold">
          ShutterChance 管理画面
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Event Token: {eventToken}
        </p>

        <QRCodeDisplay guestUrl={guestUrl} />
      </div>
    </main>
  );
}
import Link from "next/link";

type Props = {
  params: Promise<{
    eventId: string;
  }>;
};

export default async function EventPhotosPage({ params }: Props) {
  const { eventId } = await params;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <Link
          href={`/dashboard/events/${eventId}`}
          className="text-sm text-muted-foreground hover:underline"
        >
          ← イベント管理に戻る
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold">写真管理</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          イベントにアップロードされた写真を管理できます。
        </p>
      </div>

      <div className="rounded-xl border bg-white p-8 text-center">
        <p className="text-muted-foreground">
          写真管理機能を準備中です。
        </p>
      </div>
    </main>
  );
}
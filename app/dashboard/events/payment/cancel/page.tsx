import Link from "next/link";
import { XCircle } from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-12">
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <XCircle className="mb-6 h-16 w-16 text-destructive" />

        <h1 className="text-2xl font-bold">
          決済がキャンセルされました
        </h1>

        <p className="mt-4 text-muted-foreground">
          決済は完了していません。
          <br />
          イベントは作成されていません。
        </p>

        <div className="mt-8 flex w-full flex-col gap-3">
          <Link
            href="/dashboard/events/new"
            className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground"
          >
            イベント作成に戻る
          </Link>

          <Link
            href="/dashboard"
            className="inline-flex h-11 items-center justify-center rounded-md border px-6 py-2 text-sm font-medium"
          >
            ダッシュボードへ戻る
          </Link>
        </div>
      </div>
    </main>
  );
}
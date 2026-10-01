import Link from "next/link";
import { redirect } from "next/navigation";
import { XCircle } from "lucide-react";

import { createAdminClient } from "@/lib/supabase/admin";

type Props = {
  params: Promise<{
    eventId: string;
  }>;
  searchParams: Promise<{
    token?: string;
  }>;
};

export default async function PaymentCancelPage({
  params,
  searchParams,
}: Props) {
  const { eventId } = await params;
  const { token } = await searchParams;

  // トークンがなければアクセス不可
  if (!token) {
    redirect("/dashboard");
  }

  const supabase = createAdminClient();

  const now = new Date().toISOString();

  // ----------------------------------------
  // 決済リターントークンを一度だけ使用
  // ----------------------------------------
  const { data: event, error } = await supabase
    .from("events")
    .update({
      payment_return_used_at: now,
    })
    .eq("id", eventId)
    .eq("payment_return_token", token)
    .gt("payment_return_expires_at", now)
    .is("payment_return_used_at", null)
    .select("id, name")
    .single();

  // トークンが無効・期限切れ・使用済みの場合
  if (error || !event) {
    redirect("/dashboard");
  }

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
          もう一度お支払い手続きを行うことができます。
        </p>

        <div className="mt-8 flex w-full flex-col gap-3">
          <Link
            href={`/dashboard/events/${event.id}`}
            className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground"
          >
            イベント管理画面へ
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
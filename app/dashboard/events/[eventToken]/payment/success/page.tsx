import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle } from "lucide-react";

import { createAdminClient } from "@/lib/supabase/admin";

type Props = {
  params: Promise<{
    eventId: string;
  }>;
  searchParams: Promise<{
    token?: string;
  }>;
};

export default async function PaymentSuccessPage({
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
        <CheckCircle className="mb-6 h-16 w-16 text-green-500" />

        <h1 className="text-2xl font-bold">
          決済が完了しました
        </h1>

        <p className="mt-4 text-muted-foreground">
          「{event.name}」のイベント作成が完了しました。
        </p>

        <Link
          href={`/dashboard/events/${event.id}`}
          className="mt-8 inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground"
        >
          イベント管理画面へ
        </Link>
      </div>
    </main>
  );
}
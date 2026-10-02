"use client";

import {
  Suspense,
  useEffect,
  useState,
} from "react";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";
import { CheckCircle } from "lucide-react";

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const sessionId =
    searchParams.get("session_id");

  const [error, setError] = useState("");

  useEffect(() => {
    if (!sessionId) {
      router.replace("/dashboard");
      return;
    }

    let cancelled = false;
    let attempts = 0;

    const checkPaymentStatus = async () => {
      try {
        const response = await fetch(
          `/api/stripe/payment-status?session_id=${encodeURIComponent(
            sessionId,
          )}`,
          {
            cache: "no-store",
          },
        );

        if (!response.ok) {
          throw new Error(
            "決済状態の確認に失敗しました。",
          );
        }

        const result =
          await response.json();

        if (cancelled) {
          return;
        }

        // ----------------------------------------
        // Webhookによるイベント作成完了
        // ----------------------------------------

        if (
          result.status === "completed" &&
          result.event?.eventToken
        ) {
          router.replace(
            `/dashboard/events/${result.event.eventToken}`,
          );
          return;
        }

        // ----------------------------------------
        // 一定回数確認してもイベントが作成されない
        // ----------------------------------------

        attempts += 1;

        if (attempts >= 20) {
          setError(
            "イベントの作成確認に時間がかかっています。ダッシュボードからご確認ください。",
          );
          return;
        }

        // 1秒後に再確認
        setTimeout(
          checkPaymentStatus,
          1000,
        );
      } catch (err) {
        console.error(err);

        if (cancelled) {
          return;
        }

        attempts += 1;

        if (attempts >= 20) {
          setError(
            "決済結果の確認に失敗しました。ダッシュボードからご確認ください。",
          );
          return;
        }

        setTimeout(
          checkPaymentStatus,
          1000,
        );
      }
    };

    checkPaymentStatus();

    return () => {
      cancelled = true;
    };
  }, [router, sessionId]);

  return (
    <main className="min-h-screen bg-background px-4 py-12">
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <CheckCircle className="mb-6 h-16 w-16 text-green-500" />

        <h1 className="text-2xl font-bold">
          決済が完了しました
        </h1>

        {error ? (
          <>
            <p className="mt-4 text-muted-foreground">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                router.replace(
                  "/dashboard",
                )
              }
              className="mt-8 inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground"
            >
              ダッシュボードへ戻る
            </button>
          </>
        ) : (
          <p className="mt-4 text-muted-foreground">
            イベントを作成しています。
            <br />
            そのまま少々お待ちください。
          </p>
        )}
      </div>
    </main>
  );
}

function PaymentSuccessFallback() {
  return (
    <main className="min-h-screen bg-background px-4 py-12">
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <CheckCircle className="mb-6 h-16 w-16 text-green-500" />

        <h1 className="text-2xl font-bold">
          決済が完了しました
        </h1>

        <p className="mt-4 text-muted-foreground">
          イベントを作成しています。
          <br />
          そのまま少々お待ちください。
        </p>
      </div>
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<PaymentSuccessFallback />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
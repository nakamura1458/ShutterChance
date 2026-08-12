"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Props = {
  eventToken: string;
};

export default function EventDeleteButton({
  eventToken,
}: Props) {
  const router = useRouter();

  const [isDeleting, setIsDeleting] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  const handleOpenChange = (open: boolean) => {
    if (!open && !isDeleting) {
      setErrorMessage(null);
    }
  };

  const handleDelete = async () => {
    setErrorMessage(null);
    setIsDeleting(true);

    try {
      const response = await fetch(
        `/api/events/${eventToken}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ||
            "イベントの削除に失敗しました"
        );
      }

      toast.success("イベントを削除しました");
      router.push("/dashboard");

    } catch (error) {
      console.error(
        "event delete error:",
        error
      );

      setErrorMessage(
        "イベントの削除に失敗しました。時間をおいて、もう一度お試しください。"
      );

      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog
      onOpenChange={handleOpenChange}
    >
      <AlertDialogTrigger
        className="rounded-xl border border-red-200 px-5 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={isDeleting}
      >
        イベントを削除
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            イベントを削除しますか？
          </AlertDialogTitle>

          <AlertDialogDescription className="text-left">
            この操作は取り消すことができません。

            <br />
            <br />

            ・イベントにアップロードされた写真がすべて削除されます。
            <br />
            ・イベントURLやQRコードからアクセスできなくなります。
            <br />
            ・削除したイベントや写真は復元できません。

            <br />
            <br />

            <span className="font-medium text-red-600">
              本当にこのイベントを削除しますか？
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        {errorMessage && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {errorMessage}
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isDeleting}
          >
            キャンセル
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {isDeleting
              ? "削除中..."
              : "削除する"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
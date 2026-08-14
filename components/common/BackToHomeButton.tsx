"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  label?: string;
};

export default function BackToHomeButton({
  label = "トップページに戻る",
}: Props) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push("/")}
      className="inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-gray-900"
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </button>
  );
}
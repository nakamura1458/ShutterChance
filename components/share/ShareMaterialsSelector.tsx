"use client";

import { useState } from "react";
import {
  Link2,
  QrCode,
  CreditCard,
  Image as ImageIcon,
} from "lucide-react";

import QRCodeDisplay from "@/components/share/QRCodeDisplay";
import ShareSection from "@/components/share/ShareSection";
import BusinessCardGenerator from "@/components/share/BusinessCardGenerator";
import TableReceptionImageGenerator from "@/components/share/TableReceptionImageGenerator";
import A3ReceptionImageGenerator from "@/components/share/A3ReceptionImageGenerator";

type Props = {
  guestUrl: string;
};

const SHARE_OPTIONS = [
  {
    value: "link",
    label: "共有リンク",
    description: "イベントURLを共有する",
    icon: Link2,
  },
  {
    value: "qr",
    label: "QRコード",
    description: "QRコードを表示・ダウンロードする",
    icon: QrCode,
  },
  {
    value: "card",
    label: "名刺サイズの共有カード",
    description: "名刺サイズのカードを作成する",
    icon: CreditCard,
  },
  {
    value: "table",
    label: "卓上用画像",
    description: "受付テーブルに置く画像を作成する",
    icon: ImageIcon,
  },
  {
    value: "poster",
    label: "会場提示用画像",
    description: "大きなQRコード画像を作成する",
    icon: ImageIcon,
  },
] as const;

export default function ShareMaterialsSelector({
  guestUrl,
}: Props) {
  const [selected, setSelected] = useState<
    (typeof SHARE_OPTIONS)[number]["value"]
  >("qr");

  const selectedOption = SHARE_OPTIONS.find(
    (option) => option.value === selected,
  )!;

  const SelectedIcon = selectedOption.icon;

  return (
    <section className="space-y-4">
      <div>
        <label
          htmlFor="share-material"
          className="mb-2 block text-sm font-semibold text-zinc-800"
        >
          共有素材を選択
        </label>

        <select
          id="share-material"
          value={selected}
          onChange={(event) =>
            setSelected(
              event.target.value as typeof selected,
            )
          }
          className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3.5 text-sm font-medium text-zinc-900 shadow-sm outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200"
        >
          {SHARE_OPTIONS.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-5 flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100">
            <SelectedIcon className="h-5 w-5 text-zinc-700" />
          </div>

          <div className="min-w-0">
            <h2 className="text-base font-semibold text-zinc-900">
              {selectedOption.label}
            </h2>
            <p className="mt-1 text-sm leading-5 text-zinc-500">
              {selectedOption.description}
            </p>
          </div>
        </div>

        {selected === "link" && (
          <ShareSection guestUrl={guestUrl} />
        )}

        {selected === "qr" && (
          <QRCodeDisplay guestUrl={guestUrl} />
        )}

        {selected === "card" && (
          <BusinessCardGenerator guestUrl={guestUrl} />
        )}

        
        {selected === "table" && (
          <TableReceptionImageGenerator guestUrl={guestUrl} />
        )}

        {selected === "poster" && (
          <A3ReceptionImageGenerator guestUrl={guestUrl} />
        )}

      </div>
    </section>
  );
}

import React from "react";
import {
  Camera,
  Cloud,
  QrCode,
} from "lucide-react";

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-7 text-center shadow-sm">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50">
        {icon}
      </div>

      <h3 className="mt-5 text-sm font-bold">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-6 text-gray-500">
        {description}
      </p>
    </div>
  );
}

export default function Solution() {
  return (
    <section className="px-5 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">
            Shutter Chance
          </p>

          <h2 className="mt-4 text-2xl font-bold sm:text-3xl">
            イベントの写真共有を、もっとかんたんに
          </h2>

          <p className="mt-5 text-xl font-medium sm:text-2xl">
            みんなの写真が、
            <br />
            <span className="text-gray-400">
              ひとつの場所に。
            </span>
          </p>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">
            結婚式やパーティー、同窓会、社内イベントなどで撮影した写真を、
            QRコードひとつでかんたんに共有。
            参加者が撮った写真を、イベントごとにまとめて楽しめます。
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-3">
          <FeatureCard
            icon={<QrCode className="h-6 w-6" />}
            title="QRコードでかんたん参加"
            description="QRコードを読み込むだけで、イベントの写真共有ページにアクセスできます。"
          />

          <FeatureCard
            icon={<Camera className="h-6 w-6" />}
            title="スマホから写真を共有"
            description="参加者が撮影した写真を、それぞれのスマートフォンからアップロードできます。"
          />

          <FeatureCard
            icon={<Cloud className="h-6 w-6" />}
            title="写真をまとめて楽しむ"
            description="参加者から集まった写真をひとつの場所で見られるので、イベントの思い出を共有できます。"
          />
        </div>
      </div>
    </section>
  );
}

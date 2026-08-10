import Link from "next/link";
import {
  ArrowLeft,
  Camera,
  Images,
  Download,
  UserRound,
  Clock,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";

type Props = {
  params: Promise<{
    eventToken: string;
  }>;
};

export default async function GuidePage({ params }: Props) {
  const { eventToken } = await params;

  return (
    <main className="min-h-screen bg-zinc-50">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-zinc-200/80 bg-zinc-50/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-2xl items-center px-4">
          <Link
            href={`/e/${eventToken}`}
            className="flex items-center gap-1.5 text-sm font-medium text-zinc-700 transition-colors hover:text-zinc-950"
          >
            <ArrowLeft className="h-4 w-4" />
            イベントに戻る
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 pb-16">
        {/* Hero */}
        <section className="py-12 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-900 text-white shadow-sm">
            <Image
              src="/icon.png"
              alt="Shutter Chance"
              width={70}
              height={70}
              className="mx-auto mb-5 rounded-2xl"
            />
          </div>

          <h1 className="text-2xl font-semibold uppercase tracking-[0.25em]">
            Shutter Chance
          </h1>

          <p className="mt-3 text-lg font-semibold text-zinc-800">
            みんなの写真を、
            <br />
            ひとつの場所に。
          </p>

          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-zinc-500">
            イベントで撮った写真を、参加者みんなでかんたんに共有できます。
          </p>
        </section>

        {/* How to use */}
        <section>
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
              How to use
            </p>

            <h2 className="mt-1 text-xl font-bold text-zinc-950">
              SHUTTER CHANCE の使い方
            </h2>
          </div>

          <div className="space-y-3">
            {/* Send */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-800">
                  <Camera className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <h3 className="font-semibold text-zinc-950">
                    写真を送る
                  </h3>

                  <p className="mt-1.5 text-sm leading-6 text-zinc-500">
                    スマートフォンにある写真を選んで、かんたんにアップロードできます。
                    複数の写真をまとめて送ることもできます。
                  </p>

                  <Link
                    href={`/e/${eventToken}`}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-zinc-900"
                  >
                    写真を送る
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Gallery */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-800">
                  <Images className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="font-semibold text-zinc-950">
                    みんなの写真を見る
                  </h3>

                  <p className="mt-1.5 text-sm leading-6 text-zinc-500">
                    参加者が送った写真を、イベントのギャラリーで楽しめます。
                    自分が撮った写真以外もチェックしてみてください。
                  </p>

                  <Link
                    href={`/e/${eventToken}`}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-zinc-900"
                  >
                    写真を見る
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Download */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-800">
                  <Download className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="font-semibold text-zinc-950">
                    気に入った写真を保存
                  </h3>

                  <p className="mt-1.5 text-sm leading-6 text-zinc-500">
                    写真をタップすると大きく表示できます。
                    気に入った写真はスマートフォンに保存できます。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mt-12">
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
              Features
            </p>

            <h2 className="mt-1 text-xl font-bold text-zinc-950">
              こんなことができます
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-zinc-200 bg-white p-4">
              <Camera className="h-5 w-5 text-zinc-700" />

              <p className="mt-3 text-sm font-semibold text-zinc-950">
                かんたんアップロード
              </p>

              <p className="mt-1 text-xs leading-5 text-zinc-500">
                スマホから写真を選ぶだけ
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-4">
              <Images className="h-5 w-5 text-zinc-700" />

              <p className="mt-3 text-sm font-semibold text-zinc-950">
                みんなで共有
              </p>

              <p className="mt-1 text-xs leading-5 text-zinc-500">
                イベントの写真をまとめて閲覧
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-4">
              <Download className="h-5 w-5 text-zinc-700" />

              <p className="mt-3 text-sm font-semibold text-zinc-950">
                写真を保存
              </p>

              <p className="mt-1 text-xs leading-5 text-zinc-500">
                気に入った写真を端末へ保存
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-4">
              <Sparkles className="h-5 w-5 text-zinc-700" />

              <p className="mt-3 text-sm font-semibold text-zinc-950">
                思い出を残す
              </p>

              <p className="mt-1 text-xs leading-5 text-zinc-500">
                みんなの視点で楽しめる
              </p>
            </div>
          </div>
        </section>

        {/* Notes */}
        <section className="mt-12">
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
              Notes
            </p>

            <h2 className="mt-1 text-xl font-bold text-zinc-950">
              ご利用について
            </h2>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5">
            <div className="space-y-4">
              {/* Name */}
              <div className="flex gap-3">
                <UserRound className="mt-0.5 h-5 w-5 shrink-0 text-zinc-500" />

                <div>
                  <p className="text-sm font-semibold text-zinc-900">
                    お名前について
                  </p>

                  <p className="mt-1 text-xs leading-5 text-zinc-500">
                    写真を送信する際には、お名前の入力が必要です。
                  </p>
                </div>
              </div>

              <div className="h-px bg-zinc-100" />

              {/* Storage period */}
              <div className="flex gap-3">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-zinc-500" />

                <div>
                  <p className="text-sm font-semibold text-zinc-900">
                    写真の保存期間
                  </p>

                  <p className="mt-1 text-xs leading-5 text-zinc-500">
                    写真には保存期間があります。
                    大切な写真は、期間内に端末へ保存してください。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="mt-12 rounded-3xl bg-zinc-900 px-6 py-10 text-center text-white">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
            <Sparkles className="h-6 w-6" />
          </div>

          <h2 className="mt-4 text-xl font-bold">
            素敵な思い出を
            <br />
            みんなで残そう。
          </h2>

          <p className="mt-3 text-sm leading-6 text-zinc-300">
            たくさんの写真を撮って、
            <br />
            Shutter Chanceで共有しましょう。
          </p>

          <Link
            href={`/e/${eventToken}`}
            className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-zinc-950 transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            イベントに戻る
          </Link>
        </section>

        {/* Footer */}
        <footer className="pt-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gray-400">
            Shutter Chance
          </p>
        </footer>
      </div>
    </main>
  );
}
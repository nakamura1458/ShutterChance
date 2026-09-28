import Link from "next/link";
import {
  ArrowLeft,
  Camera,
  Images,
  Download,
  UserRound,
  Clock,
  Sparkles,
  Check,
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
        <div className="mx-auto flex h-15 max-w-2xl items-center px-4">
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
        <section className="py-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center">
            <Image
              src="/icon.png"
              alt="Shutter Chance"
              width={64}
              height={64}
              className="rounded-2xl"
            />
          </div>

          <h1 className="mt-5 text-2xl font-semibold uppercase tracking-[0.2em]">
            Shutter Chance
          </h1>

          <p className="mt-4 text-xl font-bold leading-8 text-zinc-950">
            写真を、
            <br />
            みんなで共有しよう。
          </p>

          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-zinc-500">
            アプリのインストールや会員登録は不要です。
            <br />
            スマートフォンだけで、かんたんに写真を共有できます。
          </p>
        </section>

        {/* How to use */}
        <section>
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
              How to use
            </p>

            <h2 className="mt-1 text-xl font-bold text-zinc-950">
              写真を送る方法
            </h2>

            <p className="mt-2 text-sm leading-6 text-zinc-500">
              4つのステップでかんたんに写真を共有できます。
            </p>
          </div>

          <div className="space-y-6">
            {/* STEP 1 */}
            <GuideStep
              number="01"
              title="お名前を入力"
              description={
                <>
                  写真を送る前に、
                  <br />
                  お名前を入力してください。
                </>
              }
              image="/guide/step-01-name.png"
              imageAlt="お名前を入力する画面"
            />

            {/* STEP 2 */}
            <GuideStep
              number="02"
              title="「撮影を始める」をタップ"
              description={
                <>
                  お名前を入力したら、
                  <br />
                  「撮影を始める」をタップします。
                </>
              }
              image="/guide/step-02-start.png"
              imageAlt="撮影を始めるボタンの画面"
            />

            {/* STEP 3 */}
            <GuideStep
              number="03"
              title="写真を撮影・選択"
              description={
                <>
                  その場で写真を撮影することも、
                  <br />
                  スマートフォンにある写真を選ぶこともできます。
                </>
              }
              image="/guide/step-03-photo.png"
              imageAlt="写真を撮影・選択する画面"
            />

            {/* STEP 4 */}
            <GuideStep
              number="04"
              title="写真をアップロード"
              description={
                <>
                  写真を確認してアップロードします。
                  <br />
                  これで写真の共有は完了です！
                </>
              }
              image="/guide/step-04-upload.png"
              imageAlt="写真をアップロードする画面"
              last
            />
          </div>
        </section>

        {/* Camera permission */}
        <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-5">
          <div className="flex gap-3">
            <Camera className="mt-0.5 h-5 w-5 shrink-0 text-zinc-500" />

            <div>
              <p className="text-sm font-semibold text-zinc-900">
                カメラの使用について
              </p>

              <p className="mt-1 text-xs leading-5 text-zinc-500">
                初めて撮影するときは、カメラへのアクセス許可を求められる場合があります。
                「許可」を選択してください。
              </p>
            </div>
          </div>
        </section>

        {/* Gallery */}
        <section className="mt-12">
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
              Gallery
            </p>

            <h2 className="mt-1 text-xl font-bold text-zinc-950">
              みんなの写真を見る
            </h2>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-800">
                <Images className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <h3 className="font-semibold text-zinc-950">
                  イベントのみんなの写真
                </h3>

                <p className="mt-1.5 text-sm leading-6 text-zinc-500">
                  参加者が送った写真を、イベントのギャラリーから見ることができます。
                </p>

                <Link
                  href={`/e/${eventToken}/photos`}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-zinc-900"
                >
                  写真を見る
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Download */}
        <section className="mt-6">
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
              {/* No account */}
              <div className="flex gap-3">
                <UserRound className="mt-0.5 h-5 w-5 shrink-0 text-zinc-500" />

                <div>
                  <p className="text-sm font-semibold text-zinc-900">
                    会員登録・ログインは不要
                  </p>

                  <p className="mt-1 text-xs leading-5 text-zinc-500">
                    ゲストの方は、アプリのインストールや会員登録をせずにご利用いただけます。
                  </p>
                </div>
              </div>

              <div className="h-px bg-zinc-100" />

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

/**
 * ゲスト向け操作ガイド
 */
function GuideStep({
  number,
  title,
  description,
  image,
  imageAlt,
  last = false,
}: {
  number: string;
  title: string;
  description: React.ReactNode;
  image: string;
  imageAlt: string;
  last?: boolean;
}) {
  return (
    <div className="relative">
      {/* Step number */}
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-xs font-bold text-white">
          {number}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
            STEP {number}
          </p>

          <h3 className="mt-0.5 text-lg font-bold text-zinc-950">
            {title}
          </h3>
        </div>
      </div>

      {/* Screenshot */}
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="relative aspect-[4/3] w-full bg-zinc-100">
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="(max-width: 672px) 100vw, 672px"
            className="object-contain"
          />
        </div>

        <div className="border-t border-zinc-100 px-5 py-4">
          <p className="text-sm leading-6 text-zinc-600">
            {description}
          </p>
        </div>
      </div>

      {/* Connector */}
      {!last && (
        <div className="absolute bottom-[-24px] left-[17px] h-6 w-px bg-zinc-200" />
      )}
    </div>
  );
}
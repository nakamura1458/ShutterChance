"use client";

import GuideCarousel, {
  type GuideCarouselStep,
} from "@/components/guide/GuideCarousel";

const steps: GuideCarouselStep[] = [
  {
    number: "01",
    title: "イベントに参加",
    description: (
      <>
        QRコードを読み取って、
        <br />
        イベントに参加します。
      </>
    ),
    image: "/guide/step-01-name.png",
    imageAlt: "イベントに参加する画面",
  },
  {
    number: "02",
    title: "撮影を始める",
    description: (
      <>
        「撮影を始める」をタップして、
        <br />
        写真を共有します。
      </>
    ),
    image: "/guide/step-02-start.png",
    imageAlt: "撮影を始める画面",
  },
  {
    number: "03",
    title: "写真を撮る",
    description: (
      <>
        その場で写真を撮ったり、
        <br />
        スマホの写真を選択できます。
      </>
    ),
    image: "/guide/step-03-photo.png",
    imageAlt: "写真を撮る画面",
  },
  {
    number: "04",
    title: "写真をアップロード",
    description: (
      <>
        選んだ写真をアップロードして、
        <br />
        みんなと共有できます。
      </>
    ),
    image: "/guide/step-04-upload.png",
    imageAlt: "写真をアップロードする画面",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="border-t border-gray-100 bg-gray-50 px-5 py-20 sm:px-6 sm:py-28"
    >
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">
            How it works
          </p>

          <h2 className="mt-4 text-2xl font-bold sm:text-3xl">
            使い方はかんたん
          </h2>

          <p className="mt-4 text-sm leading-6 text-gray-500">
            QRコードから参加して、
            <br />
            写真をアップロードするだけ。
          </p>
        </div>

        {/* Steps */}
        <div className="mt-10">
          <GuideCarousel steps={steps} />
        </div>
      </div>
    </section>
  );
}
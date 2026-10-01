"use client";

import GuideCarousel, {
  type GuideCarouselStep,
} from "@/components/guide/GuideCarousel";

const steps: GuideCarouselStep[] = [
  {
    number: "01",
    title: "お名前を入力",
    description: (
      <>
        写真を送る前に、
        <br />
        お名前を入力してください。
      </>
    ),
    image: "/guide/step-01-name.png",
    imageAlt: "お名前を入力する画面",
  },
  {
    number: "02",
    title: "「撮影を始める」をタップ",
    description: (
      <>
        お名前を入力したら、
        <br />
        「撮影を始める」をタップします。
      </>
    ),
    image: "/guide/step-02-start.png",
    imageAlt: "撮影を始めるボタンの画面",
  },
  {
    number: "03",
    title: "写真を撮影・選択",
    description: (
      <>
        その場で写真を撮影することも、
        <br />
        スマートフォンにある写真を選ぶこともできます。
      </>
    ),
    image: "/guide/step-03-photo.png",
    imageAlt: "写真を撮影・選択する画面",
  },
  {
    number: "04",
    title: "写真をアップロード",
    description: (
      <>
        写真を確認してアップロードします。
        <br />
        これで写真の共有は完了です！
      </>
    ),
    image: "/guide/step-04-upload.png",
    imageAlt: "写真をアップロードする画面",
  },
];

export default function GuideSteps() {
  return <GuideCarousel steps={steps} />;
}
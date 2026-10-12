
function ProblemCard({ text }: { text: string }) {
  return (
    <div className="rounded-2xl bg-white px-5 py-5 text-left shadow-sm">
      <p className="text-sm text-gray-600">{text}</p>
    </div>
  );
}

export default function Problem() {
  return (
    <section className="border-t border-gray-100 bg-gray-50 px-5 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">
          Problem
        </p>

        <h2 className="mt-4 text-2xl font-bold sm:text-3xl">
          イベントの写真共有、こんなお悩みありませんか？
        </h2>

        <p className="mt-6 text-lg font-medium text-gray-700">
          「撮った写真、あとで送って！」
        </p>

        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          <ProblemCard text="参加者それぞれのスマホに写真が分散してしまう" />
          <ProblemCard text="LINEなどで一枚ずつ写真を送ってもらうのが大変" />
          <ProblemCard text="声をかけても、なかなか写真が集まらない" />
          <ProblemCard text="写真共有のためにアプリを入れてもらうのは面倒" />
        </div>
      </div>
    </section>
  );
}

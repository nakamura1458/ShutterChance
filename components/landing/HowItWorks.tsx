function Step({
  number,
  title,
}: {
  number: string;
  title: string;
}) {
  return (
    <div className="relative text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-sm font-bold shadow-sm ring-1 ring-gray-100">
        {number}
      </div>

      <h3 className="mt-5 text-sm font-bold">
        {title}
      </h3>
    </div>
  );
}

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="border-t border-gray-100 bg-gray-50 px-5 py-20 sm:px-6 sm:py-28"
    >
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">
            How it works
          </p>

          <h2 className="mt-4 text-2xl font-bold sm:text-3xl">
            使い方はかんたん
          </h2>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-4">
          <Step number="01" title="イベントを作る" />
          <Step number="02" title="QRコードを共有" />
          <Step number="03" title="写真を撮る" />
          <Step number="04" title="みんなで見る" />
        </div>
      </div>
    </section>
  );
}
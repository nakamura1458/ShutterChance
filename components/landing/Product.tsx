function PhoneMockup({ title }: { title: string }) {
  return (
    <div className="hidden w-48 shrink-0 rounded-[2rem] border-[6px] border-gray-900 bg-white p-2 shadow-xl first:block sm:block">
      <div className="overflow-hidden rounded-[1.5rem] bg-gray-50">
        <div className="flex h-8 items-center justify-center">
          <div className="h-1 w-12 rounded-full bg-gray-300" />
        </div>

        <div className="aspect-[9/16] bg-gray-100">
          <div className="grid grid-cols-2 gap-1 p-2 pt-5">
            <div className="aspect-square rounded-lg bg-gray-200" />
            <div className="aspect-square rounded-lg bg-gray-300" />
            <div className="aspect-square rounded-lg bg-gray-300" />
            <div className="aspect-square rounded-lg bg-gray-200" />
            <div className="aspect-square rounded-lg bg-gray-300" />
            <div className="aspect-square rounded-lg bg-gray-200" />
          </div>
        </div>

        <div className="px-3 py-3">
          <p className="text-center text-[10px] font-medium">
            {title}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Product() {
  return (
    <section className="overflow-hidden px-5 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">
            Product
          </p>

          <h2 className="mt-4 text-2xl font-bold sm:text-3xl">
            実際の{" "}
            <span className="uppercase">
              Shutter Chance
            </span>
          </h2>

          <p className="mt-5 text-sm leading-7 text-gray-500">
            撮った写真をその場で共有。
            <br />
            集まった写真をみんなで楽しめます。
          </p>
        </div>

        <div className="mt-14 flex justify-center gap-5">
          <PhoneMockup title="写真を撮る" />
          <PhoneMockup title="みんなの写真" />
          <PhoneMockup title="写真を見る" />
        </div>
      </div>
    </section>
  );
}
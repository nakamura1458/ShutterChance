import { ArrowRight } from "lucide-react";

type FinalCtaProps = {
  onCreateEvent: () => void;
};

export default function FinalCta({
  onCreateEvent,
}: FinalCtaProps) {
  return (
    <section className="bg-black px-5 py-24 text-center text-white sm:px-6 sm:py-32">
      <div className="mx-auto max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
          Shutter Chance
        </p>

        <h2 className="mt-6 text-3xl font-bold leading-tight sm:text-4xl">
          思い出を、
          <br />
          みんなの写真で残そう。
        </h2>

        <p className="mt-6 text-sm leading-7 text-gray-400">
          結婚式の一日を、
          <br />
          みんなが撮った写真と一緒に。
        </p>

        <button
          type="button"
          onClick={onCreateEvent}
          className="mt-9 inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-medium text-black transition hover:bg-gray-100 active:scale-[0.98]"
        >
          イベントを作る
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
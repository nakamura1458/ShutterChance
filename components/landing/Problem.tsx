import React from "react";

function ProblemCard({ text }: { text: string }) {
  return (
    <div className="rounded-2xl bg-white px-5 py-5 text-left shadow-sm">
      <p className="text-sm text-gray-600">
        {text}
      </p>
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
          こんな経験ありませんか？
        </h2>

        <p className="mt-6 text-lg font-medium text-gray-700">
          「あとで写真送って！」
        </p>

        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          <ProblemCard text="写真がバラバラになる" />
          <ProblemCard text="LINEで一枚ずつ送ってもらう" />
          <ProblemCard text="なかなか写真が集まらない" />
          <ProblemCard text="アプリを入れてもらえない" />
        </div>
      </div>
    </section>
  );
}
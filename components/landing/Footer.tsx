export default function Footer() {
  return (
    <footer className="bg-black px-5 pb-8 text-white sm:px-6">
      <div className="mx-auto max-w-6xl border-t border-white/10 pt-7">
        <div className="flex flex-col items-center justify-between gap-5 sm:flex-row">
          <p className="text-sm font-semibold uppercase tracking-[0.2em]">
            Shutter Chance
          </p>

          <div className="flex items-center gap-4 text-xs text-gray-500">
            <button
              type="button"
              className="transition hover:text-white"
            >
              利用規約
            </button>

            <span>・</span>

            <button
              type="button"
              className="transition hover:text-white"
            >
              プライバシーポリシー
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-600 sm:text-left">
          © 2026 ShutterChance
        </p>
      </div>
    </footer>
  );
}
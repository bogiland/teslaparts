import { Leaf } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-zinc-950 py-32 text-white sm:py-40">
      <div className="absolute inset-0 opacity-50">
        <img src="/images/charger.jpg" alt="Tesla" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-r from-zinc-950 via-zinc-950/80 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-400">
            <Leaf className="h-4 w-4" />
            <span>Экологичное будущее</span>
          </div>

          <h1 className="mb-6 text-5xl font-light tracking-tight sm:text-6xl">
            Оригинальные детали для вашей <span className="font-bold text-emerald-500">Tesla</span>
          </h1>

          <p className="mb-10 text-lg font-light leading-relaxed text-gray-400 sm:text-xl">
            Премиальные автозапчасти и аксессуары. 100% совместимость, гарантия качества и забота об экологичном будущем в
            каждой детали.
          </p>

          <a
            href="#catalog"
            className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-8 py-4 text-base font-medium text-white shadow-[0_0_20px_rgba(5,150,105,0.3)] transition-all duration-300 hover:bg-emerald-500 hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]"
          >
            Открыть каталог
          </a>
        </div>
      </div>
    </section>
  );
}

import { BatteryCharging } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-zinc-950 py-16 text-gray-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5">
            <Link to="/" className="group mb-6 inline-flex items-center gap-3">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-2 transition-colors group-hover:bg-emerald-500/20">
                <BatteryCharging className="h-5 w-5 text-emerald-500" />
              </div>
              <h3 className="text-xl font-light uppercase tracking-widest text-white">
                Tesla<span className="font-bold text-emerald-500">Parts</span>
              </h3>
            </Link>
            <p className="max-w-sm text-sm font-light leading-relaxed">
              Ваш надежный партнер в мире оригинальных запчастей и аксессуаров для автомобилей Tesla. Поддерживаем переход
              на устойчивую энергетику и качественный сервис.
            </p>
          </div>

          <div className="md:col-span-3 md:col-start-7">
            <h4 className="mb-6 text-xs font-medium uppercase tracking-widest text-white">Контакты</h4>
            <ul className="space-y-4 text-sm font-light">
              <li className="flex items-center gap-3">
                <span className="text-zinc-600">Тел:</span> +373 60 000 000
              </li>
              <li className="flex items-center gap-3">
                <span className="text-zinc-600">Email:</span> info@teslaparts.md
              </li>
              <li className="flex items-center gap-3">
                <span className="text-zinc-600">Адрес:</span> Кишинев, ул. Студенческая 9/7
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="mb-6 text-xs font-medium uppercase tracking-widest text-white">Навигация</h4>
            <ul className="space-y-4 text-sm font-light">
              <li>
                <Link to="/" className="transition-colors hover:text-emerald-400">
                  Каталог товаров
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="transition-colors hover:text-emerald-400">
                  Избранное
                </Link>
              </li>
              <li>
                <Link to="/about" className="transition-colors hover:text-emerald-400">
                  О компании
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-center text-sm font-light md:flex-row">
          <p>&copy; {new Date().getFullYear()} TeslaParts. Все права защищены.</p>
          <p className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-5 py-2 text-xs text-emerald-500/80">
            Учебный проект ТУМ. Лектор: Александру Ярославски.
          </p>
        </div>
      </div>
    </footer>
  );
}

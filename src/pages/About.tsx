export default function About() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 sm:py-20">
      <div className="mx-auto max-w-4xl">
        <div className="mb-16 text-center">
          <h1 className="mb-6 text-4xl font-light tracking-tight text-zinc-900 sm:text-5xl">
            О компании <span className="font-bold text-emerald-600">TeslaParts</span>
          </h1>
          <p className="text-xl font-light text-gray-500">Экологичные решения и премиальный сервис для вашего электромобиля.</p>
        </div>

        <div className="max-w-none text-gray-600">
          <img
            src="/images/console.webp"
            alt="Магазин TeslaParts"
            className="mb-12 h-80 w-full rounded-3xl object-cover shadow-xl sm:h-125"
          />

          <p className="mb-8 text-xl font-light leading-relaxed text-zinc-800">
            Добро пожаловать в <strong>TeslaParts</strong> - ваш надежный интернет-магазин оригинальных автозапчастей и
            аксессуаров для электромобилей Tesla. Мы верим в устойчивое будущее и поддерживаем переход на экологически
            чистый транспорт.
          </p>

          <h2 className="mb-6 mt-16 text-3xl font-light text-zinc-900">Наша миссия</h2>
          <p className="mb-8 font-light leading-relaxed">
            Мы стремимся сделать обслуживание и персонализацию автомобилей Tesla доступными, быстрыми и качественными. Наша
            команда тщательно отбирает каждую деталь, чтобы гарантировать совместимость, надежность и соответствие высоким
            стандартам бренда.
          </p>

          <div className="my-16 grid grid-cols-1 gap-8 sm:grid-cols-2">
            <div className="rounded-3xl border border-gray-100 bg-zinc-50 p-10 transition-shadow hover:shadow-lg">
              <h3 className="mb-4 text-2xl font-medium text-zinc-900">Оригинальное качество</h3>
              <p className="font-light leading-relaxed text-gray-500">
                Все запчасти проходят строгий контроль качества и соответствуют стандартам Tesla. Мы не идем на компромиссы,
                когда речь идет о надежности.
              </p>
            </div>
            <div className="rounded-3xl border border-gray-100 bg-zinc-50 p-10 transition-shadow hover:shadow-lg">
              <h3 className="mb-4 text-2xl font-medium text-zinc-900">Эко-доставка</h3>
              <p className="font-light leading-relaxed text-gray-500">
                Собственная логистика и продуманные процессы помогают нам доставлять заказы быстро и с минимальным влиянием
                на окружающую среду.
              </p>
            </div>
          </div>

          <div className="mt-16 flex flex-col items-start gap-6 rounded-3xl border border-emerald-100 bg-emerald-50/50 p-8 sm:flex-row sm:items-center sm:p-10">
            <div className="shrink-0 rounded-2xl bg-emerald-100 p-4">
              <svg className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <h4 className="mb-2 text-xl font-medium text-zinc-900">Учебный проект ТУМ</h4>
              <p className="font-light text-gray-600">
                Этот сайт разработан в рамках дисциплины "Frontend Development с React" в Техническом Университете Молдовы.
                Лектор: Александру Ярославски.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

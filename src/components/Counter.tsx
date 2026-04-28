type CounterProps = {
  foundCount: number;
  cartCount: number;
};

export default function Counter({ foundCount, cartCount }: CounterProps) {
  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-zinc-50 p-5">
      <div className="font-light text-gray-500">
        Найдено товаров:
        <span className="ml-1 font-medium text-zinc-900">{foundCount}</span>
      </div>
      <div className="font-light text-gray-500">
        В корзине:
        <span className="ml-1 font-medium text-emerald-600">{cartCount}</span> шт.
      </div>
    </div>
  );
}

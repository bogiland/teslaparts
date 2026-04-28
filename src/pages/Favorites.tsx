import { HeartCrack } from "lucide-react";
import { Link } from "react-router-dom";
import ProductList from "../components/ProductList";
import type { Product } from "../data/products";

type FavoritesProps = {
  favorites: Product[];
  onAddToCart: (product: Product) => void;
  onToggleFavorite: (product: Product) => void;
};

export default function Favorites({ favorites, onAddToCart, onToggleFavorite }: FavoritesProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 sm:py-20">
      <h1 className="mb-10 text-4xl font-light tracking-tight text-zinc-900">Избранное</h1>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-gray-100 bg-zinc-50 py-32 text-center">
          <HeartCrack className="mb-6 h-16 w-16 text-gray-300" />
          <h2 className="mb-3 text-2xl font-medium text-zinc-900">Список желаний пуст</h2>
          <p className="mb-10 max-w-md font-light text-gray-500">
            Сохраняйте интересующие вас детали, чтобы быстро вернуться к ним при следующем визите.
          </p>
          <Link
            to="/"
            className="rounded-full bg-emerald-600 px-8 py-4 font-medium text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-700"
          >
            Перейти в каталог
          </Link>
        </div>
      ) : (
        <ProductList
          products={favorites}
          onAddToCart={onAddToCart}
          favorites={favorites}
          onToggleFavorite={onToggleFavorite}
        />
      )}
    </div>
  );
}

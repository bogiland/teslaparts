import { Heart, ShoppingCart } from "lucide-react";
import { useEffect, useMemo, useState, type Key } from "react";
import { categoryLabels, type Product } from "../data/products";

type ProductCardProps = Product & {
  key?: Key;
  onAddToCart: (product: Product) => void;
  isFavorite: boolean;
  onToggleFavorite: (product: Product) => void;
};

export default function ProductCard({
  id,
  name,
  price,
  category,
  image,
  fallbackImage,
  onAddToCart,
  isFavorite,
  onToggleFavorite,
}: ProductCardProps) {
  const product = useMemo(
    () => ({ id, name, price, category, image, fallbackImage }),
    [id, name, price, category, image, fallbackImage],
  );
  const [imgSrc, setImgSrc] = useState(image);

  useEffect(() => {
    setImgSrc(image);
  }, [image]);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <button
        type="button"
        onClick={() => onToggleFavorite(product)}
        className="absolute right-4 top-4 z-10 rounded-full bg-white/80 p-2.5 text-gray-400 shadow-sm backdrop-blur-md transition-all hover:text-emerald-500 hover:shadow-md"
        title={isFavorite ? "Убрать из избранного" : "Добавить в избранное"}
        aria-label={
          isFavorite ? "Убрать из избранного" : "Добавить в избранное"
        }
      >
        <Heart
          className={`h-5 w-5 transition-colors ${isFavorite ? "fill-emerald-500 text-emerald-500" : ""}`}
        />
      </button>

      <div className="relative flex h-64 items-center justify-center overflow-hidden bg-zinc-50 p-6">
        <img
          src={imgSrc}
          alt={name}
          onError={() => setImgSrc(fallbackImage)}
          className="h-full w-full rounded-xl object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute left-4 top-4 rounded-md bg-zinc-900/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-md">
          {categoryLabels[category]}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="grow text-lg font-medium text-zinc-900">{name}</h3>
        <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
          <span className="text-2xl font-light text-zinc-900">${price}</span>
          <button
            type="button"
            onClick={() => onAddToCart(product)}
            className="flex items-center justify-center rounded-full bg-zinc-900 p-3 text-white shadow-sm transition-colors hover:bg-emerald-600"
            title="Добавить в корзину"
            aria-label="Добавить в корзину"
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
        </div>
      </div>
    </article>
  );
}

import type { Product } from "../data/products";
import ProductCard from "./ProductCard";

type ProductListProps = {
  products: Product[];
  onAddToCart: (product: Product) => void;
  favorites: Product[];
  onToggleFavorite: (product: Product) => void;
};

export default function ProductList({ products, onAddToCart, favorites, onToggleFavorite }: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-3xl border border-gray-100 bg-gray-50 py-16 text-center">
        <p className="text-lg text-gray-500">По вашему запросу ничего не найдено.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          price={product.price}
          category={product.category}
          image={product.image}
          fallbackImage={product.fallbackImage}
          onAddToCart={onAddToCart}
          isFavorite={favorites.some((favorite) => favorite.id === product.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}

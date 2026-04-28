import { Loader2, TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";
import Counter from "../components/Counter";
import FilterButtons from "../components/FilterButtons";
import Hero from "../components/Hero";
import ProductList from "../components/ProductList";
import SearchBar from "../components/SearchBar";
import { products as fallbackProducts, type Category, type Product } from "../data/products";

type HomeProps = {
  cart: Product[];
  onAddToCart: (product: Product) => void;
  favorites: Product[];
  onToggleFavorite: (product: Product) => void;
};

export default function Home({ cart, onAddToCart, favorites, onToggleFavorite }: HomeProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category>("all");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error("Не удалось загрузить каталог с сервера.");
        }

        const data: Product[] = await response.json();
        setProducts(data);
      } catch (fetchError) {
        console.error("Ошибка загрузки каталога:", fetchError);
        setProducts(fallbackProducts);
        setError("Сервер временно недоступен. Показаны локальные данные каталога.");
      } finally {
        setLoading(false);
      }
    };

    void fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "all" || product.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Hero />

      <section id="catalog" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 sm:py-24">
        <div className="mb-10 space-y-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">Каталог запчастей</h2>
            <SearchBar value={search} onChange={setSearch} />
          </div>
          <FilterButtons activeCategory={category} onCategoryChange={setCategory} />
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800">
            <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <Counter foundCount={filteredProducts.length} cartCount={cart.length} />

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="mb-4 h-12 w-12 animate-spin text-emerald-500" />
            <p className="font-light text-gray-500">Загрузка товаров с сервера...</p>
          </div>
        ) : (
          <ProductList
            products={filteredProducts}
            onAddToCart={onAddToCart}
            favorites={favorites}
            onToggleFavorite={onToggleFavorite}
          />
        )}
      </section>
    </>
  );
}

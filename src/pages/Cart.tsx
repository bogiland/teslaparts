import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { Product } from "../data/products";

export type CartItem = {
  product: Product;
  quantity: number;
};

type CartProps = {
  cartItems: CartItem[];
  onIncrease: (productId: number) => void;
  onDecrease: (productId: number) => void;
  onRemove: (productId: number) => void;
};

export default function Cart({
  cartItems,
  onIncrease,
  onDecrease,
  onRemove,
}: CartProps) {
  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  if (cartItems.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 sm:py-20">
        <div className="flex min-h-[28rem] flex-col items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 px-6 text-center">
          <ShoppingCart className="mb-5 h-14 w-14 text-zinc-300" />
          <h1 className="text-3xl font-semibold text-zinc-900">
            Your cart is empty
          </h1>
          <p className="mt-3 max-w-md text-zinc-500">
            Add products from the catalog and they will appear here with
            quantity controls.
          </p>
          <Link
            to="/"
            className="mt-8 inline-flex items-center rounded-full bg-emerald-600 px-6 py-3 font-medium text-white transition hover:bg-emerald-500"
          >
            Return to catalog
          </Link>
        </div>
      </div>
    );
  }

  const [notice, setNotice] = useState<string | null>(null);

  const handleBuy = () => {
    setNotice("Спасибо за покупку! Ваш заказ принят.");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 sm:py-20">
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-4xl font-semibold text-zinc-900">Cart</h1>
          <p className="mt-2 text-zinc-500">
            Review selected parts before checkout.
          </p>
        </div>
        <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-5 py-4 text-right">
          <div className="text-sm text-emerald-700">Subtotal</div>
          <div className="text-3xl font-semibold text-emerald-700">
            ${total}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.8fr]">
        <div className="space-y-4">
          {cartItems.map(({ product, quantity }) => (
            <article
              key={product.id}
              className="grid gap-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:grid-cols-[120px_1fr_auto]"
            >
              <div className="h-28 overflow-hidden rounded-lg bg-zinc-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.src = product.fallbackImage;
                  }}
                />
              </div>

              <div className="min-w-0">
                <h2 className="text-lg font-medium text-zinc-900">
                  {product.name}
                </h2>
                <p className="mt-2 text-sm text-zinc-500">{product.category}</p>
                <p className="mt-4 text-xl font-semibold text-zinc-900">
                  ${product.price}
                </p>
              </div>

              <div className="flex flex-col items-start gap-4 sm:items-end">
                <div className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 p-1">
                  <button
                    type="button"
                    onClick={() => onDecrease(product.id)}
                    className="rounded-full p-2 text-zinc-600 transition hover:bg-white hover:text-emerald-600"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="min-w-10 text-center text-sm font-semibold text-zinc-900">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => onIncrease(product.id)}
                    className="rounded-full p-2 text-zinc-600 transition hover:bg-white hover:text-emerald-600"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => onRemove(product.id)}
                  className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 transition hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </button>
              </div>
            </article>
          ))}
        </div>

        <aside className="h-fit rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-zinc-900">Summary</h2>
          <div className="mt-6 space-y-4 text-sm text-zinc-600">
            {cartItems.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="flex items-start justify-between gap-4"
              >
                <span className="line-clamp-2">
                  {product.name} x{quantity}
                </span>
                <span className="shrink-0 font-medium text-zinc-900">
                  ${product.price * quantity}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-col gap-4 border-t border-zinc-100 pt-5">
            <div className="flex items-center justify-between">
              <span className="text-base font-medium text-zinc-900">Total</span>
              <span className="text-2xl font-semibold text-emerald-700">
                ${total}
              </span>
            </div>
            <button
              type="button"
              onClick={handleBuy}
              className="w-full rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
            >
              Buy now
            </button>
            {notice && (
              <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                {notice}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

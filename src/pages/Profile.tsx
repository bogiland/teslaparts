import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUser, type CurrentUser } from "../lib/auth";

type OrderItem = {
  productId: number;
  name: string;
  price: number;
  quantity: number;
};

type Order = {
  id: number;
  username: string;
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: string;
};

export default function Profile() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);

  const currentUser = getCurrentUser();
  if (!currentUser) {
    return <Navigate to="/login" replace state={{ from: "/profile" }} />;
  }

  const fetchOrders = async () => {
    setLoading(true);
    setNotice(null);

    try {
      const response = await fetch("/api/orders", {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Не удалось загрузить заказы.");
      }

      const data = (await response.json()) as Order[];
      setOrders(data);
    } catch (error) {
      console.error(error);
      setNotice("Произошла ошибка при загрузке истории заказов.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchOrders();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 pt-24 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Личный кабинет</h1>
          <p className="mt-2 text-zinc-500">
            Привет,{" "}
            <span className="font-semibold">{currentUser.username}</span>. Здесь
            хранится история ваших заказов.
          </p>
        </div>
      </div>

      {notice && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800">
          {notice}
        </div>
      )}

      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-zinc-900">Мои заказы</h2>

        {loading ? (
          <div className="mt-8 flex justify-center py-10">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
          </div>
        ) : orders.length === 0 ? (
          <p className="mt-6 text-zinc-500">
            У вас пока нет заказов. Добавьте товары в корзину и оформите первый
            заказ.
          </p>
        ) : (
          <div className="mt-6 space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-sm text-zinc-500">
                      Заказ #{order.id}
                    </div>
                    <div className="mt-1 text-lg font-semibold text-zinc-900">
                      {new Date(order.createdAt).toLocaleString("ru-RU")}
                    </div>
                  </div>
                  <div className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-800">
                    {order.status}
                  </div>
                </div>

                <div className="mt-4 border-t border-zinc-200 pt-4 text-sm text-zinc-700">
                  <div className="mb-3 font-medium text-zinc-900">
                    Содержимое заказа
                  </div>
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div
                        key={`${order.id}-${item.productId}`}
                        className="flex items-center justify-between gap-3"
                      >
                        <div>
                          <div className="font-medium text-zinc-900">
                            {item.name}
                          </div>
                          <div className="text-zinc-500">
                            Количество: {item.quantity}
                          </div>
                        </div>
                        <div className="font-semibold text-zinc-900">
                          ${item.price * item.quantity}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-zinc-200 pt-4 text-sm text-zinc-700">
                  <span>Итого</span>
                  <span className="font-semibold text-zinc-900">
                    ${order.total}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

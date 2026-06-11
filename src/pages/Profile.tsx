import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { apiUrl } from "../lib/api";
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
  phone?: string;
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: string;
};

export default function Profile() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const currentUser = getCurrentUser();
  if (!currentUser) {
    return <Navigate to="/login" replace state={{ from: "/profile" }} />;
  }

  const fetchOrders = async () => {
    if (!currentUser) {
      setNotice("Не удалось получить данные пользователя.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setNotice(null);

    try {
      console.log("Fetching orders for user:", currentUser.username);
      console.log("Token:", currentUser.token ? "Present" : "Missing");

      const response = await fetch(apiUrl("/api/orders"), {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        const serverMessage = errorBody?.message ? ` ${errorBody.message}` : "";
        console.error("Server error:", errorBody);
        throw new Error(
          `Не удалось загрузить заказы (${response.status}).${serverMessage}`,
        );
      }

      const data = (await response.json()) as Order[];
      console.log("Orders received:", data);
      setOrders(data);
    } catch (error) {
      console.error("Fetch error:", error);
      if (error instanceof Error) {
        setNotice(error.message);
      } else {
        setNotice("Произошла ошибка при загрузке истории заказов.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await fetch(apiUrl("/api/profile"), {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });

      if (!response.ok) {
        return;
      }

      const data = (await response.json()) as { phone?: string };
      setPhone(data.phone ?? "");
    } catch (error) {
      console.error("Fetch profile error:", error);
    }
  };

  const handleSavePhone = async () => {
    setPhoneLoading(true);
    setNotice(null);

    try {
      const response = await fetch(apiUrl("/api/profile"), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify({ phone }),
      });

      if (!response.ok) {
        throw new Error("Не удалось сохранить номер телефона.");
      }

      const data = (await response.json()) as { phone?: string };
      setPhone(data.phone ?? "");
      setNotice("Номер телефона сохранен.");
    } catch (error) {
      console.error("Save phone error:", error);
      setNotice(
        error instanceof Error
          ? error.message
          : "Произошла ошибка при сохранении телефона.",
      );
    } finally {
      setPhoneLoading(false);
    }
  };

  useEffect(() => {
    void fetchProfile();
    void fetchOrders();
  }, [currentUser?.username]);

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

      <div className="mb-8 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-zinc-900">Телефон</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
          <input
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="+373..."
            className="rounded-lg border border-zinc-300 px-4 py-3 text-zinc-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
          />
          <button
            type="button"
            onClick={handleSavePhone}
            disabled={phoneLoading}
            className="rounded-lg bg-zinc-900 px-5 py-3 font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {phoneLoading ? "Сохранение..." : "Сохранить"}
          </button>
        </div>
      </div>

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

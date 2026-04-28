import { ArrowRight, Lock, UserRound } from "lucide-react";
import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { getCurrentUser, setCurrentUser, type CurrentUser } from "../lib/auth";

type LoginProps = {
  onLogin: (user: CurrentUser) => void;
};

export default function Login({ onLogin }: LoginProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("12345678BAN");
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const existingUser = getCurrentUser();
  if (existingUser) {
    return (
      <Navigate
        to={existingUser.role === "Администратор" ? "/admin" : "/"}
        replace
      />
    );
  }

  const redirectFrom =
    typeof location.state === "object" &&
    location.state !== null &&
    "from" in location.state &&
    typeof location.state.from === "string"
      ? location.state.from
      : "/";

  const handleSubmit = async () => {
    setLoading(true);
    setNotice(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data: { token: string; username: string; role: string } =
        await response.json();
      const user: CurrentUser = {
        username: data.username,
        role: data.role,
        token: data.token,
      };

      setCurrentUser(user);
      onLogin(user);

      const nextRoute =
        data.role === "Администратор"
          ? "/admin"
          : redirectFrom === "/admin"
            ? "/"
            : redirectFrom;
      navigate(nextRoute, { replace: true });
    } catch (error) {
      console.error("Login failed:", error);
      setNotice("Не удалось войти. Проверьте логин и пароль.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-zinc-950 text-white">
      <div className="absolute inset-0 opacity-35">
        <img
          src="/images/charger.jpg"
          alt="Tesla charger"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-zinc-950 via-zinc-950/88 to-zinc-900/70" />
      </div>

      <div className="relative mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div className="max-w-xl">
          <h1 className="text-5xl font-light tracking-tight sm:text-6xl">
            Sign in to Tesla Parts
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-zinc-300">
            Войдите как администратор или обычный пользователь.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm text-zinc-300">
            <span className="rounded-full border border-zinc-700 bg-zinc-900/70 px-4 py-2">
              Default admin: <strong>admin</strong>
            </span>
            <span className="rounded-full border border-zinc-700 bg-zinc-900/70 px-4 py-2">
              Password: <strong>12345678BAN</strong>
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/8 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-white">Login</h2>
            <p className="mt-2 text-sm text-zinc-300">
              Введите ваши данные для входа или зарегистрируйтесь.
            </p>
          </div>

          {notice && (
            <div className="mb-5 rounded-lg border border-amber-400/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
              {notice}
            </div>
          )}

          <div className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-zinc-200">
                Username
              </span>
              <div className="relative">
                <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-zinc-900/80 py-3 pl-10 pr-4 text-white outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-zinc-200">
                Password
              </span>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-zinc-900/80 py-3 pl-10 pr-4 text-white outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>
            </label>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 font-medium text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Signing in..." : "Sign in"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <p className="mt-5 text-sm text-zinc-400">
            Нет аккаунта?{" "}
            <Link
              to="/register"
              className="text-emerald-400 hover:text-emerald-300"
            >
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

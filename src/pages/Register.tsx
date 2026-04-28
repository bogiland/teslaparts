import { ArrowRight, Lock, UserRound } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getValidationErrors = (
    usernameValue: string,
    passwordValue: string,
  ) => {
    const errors: string[] = [];
    const trimmedUsername = usernameValue.trim();

    if (trimmedUsername.length < 4) {
      errors.push("Имя должно содержать минимум 4 символа.");
    }

    if (passwordValue.length < 5) {
      errors.push("Пароль должен быть минимум 5 символов.");
    }

    if (!/[A-ZА-Я]/.test(passwordValue)) {
      errors.push("Пароль должен содержать хотя бы одну заглавную букву.");
    }

    if (!/\d/.test(passwordValue)) {
      errors.push("Пароль должен содержать хотя бы одну цифру.");
    }

    return errors;
  };

  const validationErrors = getValidationErrors(username, password);

  const handleSubmit = async () => {
    const errors = getValidationErrors(username, password);
    if (errors.length > 0) {
      setNotice(errors.join(" "));
      return;
    }

    setLoading(true);
    setNotice(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        const message = errorBody?.message ?? "Registration failed";
        throw new Error(message);
      }

      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Registration failed:", error);
      setNotice(
        error instanceof Error
          ? error.message
          : "Не удалось зарегистрироваться.",
      );
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
            Create your account
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-zinc-300">
            Регистрация обычного пользователя для работы с избранным и
            каталогом.
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/8 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-white">Register</h2>
            <p className="mt-2 text-sm text-zinc-300">
              Введите логин и пароль, чтобы создать обычную учётную запись.
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

            {validationErrors.length > 0 && (
              <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
                <p className="mb-2 font-semibold">
                  Требования к паролю и логину:
                </p>
                <ul className="list-inside list-disc space-y-1">
                  {validationErrors.map((error) => (
                    <li key={error}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 font-medium text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Registering..." : "Register"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <p className="mt-5 text-sm text-zinc-400">
            Уже есть аккаунт?{" "}
            <Link
              to="/login"
              className="text-emerald-400 hover:text-emerald-300"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

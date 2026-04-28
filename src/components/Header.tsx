import {
  BatteryCharging,
  Heart,
  LogIn,
  LogOut,
  Menu,
  Settings,
  ShoppingCart,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

type HeaderProps = {
  cartCount: number;
  favoritesCount: number;
  isAuthenticated: boolean;
  isAdmin: boolean;
  onLogout: () => void;
};

export default function Header({
  cartCount,
  favoritesCount,
  isAuthenticated,
  isAdmin,
  onLogout,
}: HeaderProps) {
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === path
      ? "font-semibold text-emerald-600"
      : "text-gray-500 hover:text-emerald-600";

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/85 text-zinc-900 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="group flex items-center gap-3">
          <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-2.5 transition-colors group-hover:bg-emerald-100">
            <BatteryCharging className="h-6 w-6 text-emerald-600" />
          </div>
          <span className="text-2xl font-light uppercase tracking-widest text-zinc-900">
            Tesla<span className="font-bold text-emerald-600">Parts</span>
          </span>
        </Link>

        <nav className="hidden items-center space-x-8 text-sm font-medium uppercase tracking-wider md:flex">
          <Link to="/" className={`transition-colors ${isActive("/")}`}>
            Catalog
          </Link>
          <Link
            to="/favorites"
            className={`transition-colors ${isActive("/favorites")}`}
          >
            Favorites
          </Link>
          <Link to="/cart" className={`transition-colors ${isActive("/cart")}`}>
            Cart
          </Link>
          <Link
            to="/about"
            className={`transition-colors ${isActive("/about")}`}
          >
            About
          </Link>
          {isAuthenticated ? (
            isAdmin ? (
              <Link
                to="/admin"
                className={`flex items-center gap-1 transition-colors ${isActive("/admin")}`}
              >
                <Settings className="h-4 w-4" />
                Admin
              </Link>
            ) : null
          ) : (
            <>
              <Link
                to="/login"
                className={`flex items-center gap-1 transition-colors ${isActive("/login")}`}
              >
                <LogIn className="h-4 w-4" />
                Sign in
              </Link>
              <Link
                to="/register"
                className={`transition-colors ${isActive("/register")}`}
              >
                Register
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center space-x-5">
          <Link
            to="/favorites"
            aria-label="Open favorites"
            className="relative flex items-center text-gray-500 transition-colors hover:text-emerald-600"
          >
            <Heart className="h-6 w-6" />
            {favoritesCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-emerald-600 text-[10px] font-bold text-white shadow-sm">
                {favoritesCount}
              </span>
            )}
          </Link>

          <Link
            to="/cart"
            aria-label="Open cart"
            className="relative flex items-center text-gray-500 transition-colors hover:text-emerald-600"
          >
            <ShoppingCart className="h-6 w-6" />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-emerald-600 text-[10px] font-bold text-white shadow-sm">
                {cartCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <button
              type="button"
              onClick={onLogout}
              aria-label="Sign out"
              className="flex items-center text-gray-500 transition-colors hover:text-emerald-600"
            >
              <LogOut className="h-6 w-6" />
            </button>
          ) : (
            <Link
              to="/login"
              aria-label="Open sign in page"
              className="flex items-center text-gray-500 transition-colors hover:text-emerald-600"
            >
              <LogIn className="h-6 w-6" />
            </Link>
          )}

          <button
            type="button"
            aria-label="Open menu"
            className="text-gray-500 hover:text-emerald-600 md:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
}

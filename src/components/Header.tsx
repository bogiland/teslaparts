import {
  BatteryCharging,
  Heart,
  LogIn,
  LogOut,
  Menu,
  Settings,
  ShoppingCart,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) =>
    location.pathname === path
      ? "font-semibold text-emerald-600"
      : "text-gray-500 hover:text-emerald-600";

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleLogoutClick = () => {
    setIsMenuOpen(false);
    onLogout();
  };

  const mobileLinkClass = (path: string) =>
    `block rounded-lg px-4 py-3 text-sm font-semibold uppercase tracking-wider transition-colors ${
      location.pathname === path
        ? "bg-emerald-50 text-emerald-700"
        : "text-zinc-700 hover:bg-zinc-50 hover:text-emerald-600"
    }`;

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
          {isAuthenticated && (
            <>
              <Link
                to="/favorites"
                className={`transition-colors ${isActive("/favorites")}`}
              >
                Favorites
              </Link>
              <Link to="/cart" className={`transition-colors ${isActive("/cart")}`}>
                Cart
              </Link>
            </>
          )}
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
            ) : (
              <Link
                to="/profile"
                className={`transition-colors ${isActive("/profile")}`}
              >
                Account
              </Link>
            )
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
          {isAuthenticated && (
            <>
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
            </>
          )}

          {isAuthenticated ? (
            <button
              type="button"
              onClick={handleLogoutClick}
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
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            className="text-gray-500 transition-colors hover:text-emerald-600 md:hidden"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="border-t border-gray-100 bg-white px-4 py-4 shadow-lg md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1">
            <Link to="/" className={mobileLinkClass("/")}>
              Catalog
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/favorites" className={mobileLinkClass("/favorites")}>
                  Favorites
                </Link>
                <Link to="/cart" className={mobileLinkClass("/cart")}>
                  Cart
                </Link>
              </>
            )}
            <Link to="/about" className={mobileLinkClass("/about")}>
              About
            </Link>
            {isAuthenticated ? (
              <>
                {isAdmin ? (
                  <Link to="/admin" className={mobileLinkClass("/admin")}>
                    Admin
                  </Link>
                ) : (
                  <Link to="/profile" className={mobileLinkClass("/profile")}>
                    Account
                  </Link>
                )}
                <button
                  type="button"
                  onClick={handleLogoutClick}
                  className="rounded-lg px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider text-zinc-700 transition-colors hover:bg-zinc-50 hover:text-emerald-600"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={mobileLinkClass("/login")}>
                  Sign in
                </Link>
                <Link to="/register" className={mobileLinkClass("/register")}>
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

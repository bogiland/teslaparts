import { useEffect, useMemo, useState } from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import type { Product } from "./data/products";
import {
  clearCurrentUser,
  getCurrentUser,
  setCurrentUser,
  type CurrentUser,
} from "./lib/auth";
import About from "./pages/About";
import Admin from "./pages/Admin";
import Cart, { type CartItem } from "./pages/Cart";
import Favorites from "./pages/Favorites";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [currentUser, setCurrentUserState] = useState<CurrentUser | null>(
    getCurrentUser(),
  );

  const isAuthenticated = Boolean(currentUser);
  const isAdmin = currentUser?.role === "Администратор";

  useEffect(() => {
    const storedCart = localStorage.getItem("tesla-cart");
    const storedUser = getCurrentUser();
    const favoriteKey = storedUser
      ? `tesla-favorites-${storedUser.username}`
      : "tesla-favorites";

    if (storedCart) {
      setCartItems(JSON.parse(storedCart) as CartItem[]);
    }

    if (storedUser) {
      setCurrentUserState(storedUser);
    }

    const storedFavorites = localStorage.getItem(favoriteKey);
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites) as Product[]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tesla-cart", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    const favoriteKey = currentUser
      ? `tesla-favorites-${currentUser.username}`
      : "tesla-favorites";
    localStorage.setItem(favoriteKey, JSON.stringify(favorites));
  }, [favorites, currentUser]);

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  );

  const handleAddToCart = (product: Product) => {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.product.id === product.id,
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...currentItems, { product, quantity: 1 }];
    });
  };

  const handleIncreaseCartItem = (productId: number) => {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );
  };

  const handleDecreaseCartItem = (productId: number) => {
    setCartItems((currentItems) =>
      currentItems.flatMap((item) => {
        if (item.product.id !== productId) {
          return item;
        }

        if (item.quantity <= 1) {
          return [];
        }

        return { ...item, quantity: item.quantity - 1 };
      }),
    );
  };

  const handleRemoveCartItem = (productId: number) => {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.product.id !== productId),
    );
  };

  const handleToggleFavorite = (product: Product) => {
    setFavorites((currentFavorites) => {
      if (currentFavorites.some((item) => item.id === product.id)) {
        return currentFavorites.filter((item) => item.id !== product.id);
      }

      return [...currentFavorites, product];
    });
  };

  const handleLogin = (user: CurrentUser) => {
    const guestFavorites = localStorage.getItem("tesla-favorites");
    const userFavorites = localStorage.getItem(
      `tesla-favorites-${user.username}`,
    );

    setCurrentUser(user);
    setCurrentUserState(user);

    const guestFavoritesList = guestFavorites
      ? (JSON.parse(guestFavorites) as Product[])
      : [];
    const userFavoritesList = userFavorites
      ? (JSON.parse(userFavorites) as Product[])
      : [];
    const mergedFavorites = [...userFavoritesList];

    guestFavoritesList.forEach((item) => {
      if (!mergedFavorites.some((favorite) => favorite.id === item.id)) {
        mergedFavorites.push(item);
      }
    });

    setFavorites(mergedFavorites);
    localStorage.setItem(
      `tesla-favorites-${user.username}`,
      JSON.stringify(mergedFavorites),
    );
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleLogout = () => {
    clearCurrentUser();
    setCurrentUserState(null);
    setFavorites([]);
  };

  return (
    <Router>
      <div className="flex min-h-screen flex-col bg-white text-zinc-900">
        <Header
          cartCount={cartCount}
          favoritesCount={favorites.length}
          isAuthenticated={isAuthenticated}
          isAdmin={isAdmin}
          onLogout={handleLogout}
        />

        <main className="flex-1">
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  cart={cartItems.map((item) => item.product)}
                  favorites={favorites}
                  onAddToCart={handleAddToCart}
                  onToggleFavorite={handleToggleFavorite}
                />
              }
            />
            <Route
              path="/favorites"
              element={
                <Favorites
                  favorites={favorites}
                  onAddToCart={handleAddToCart}
                  onToggleFavorite={handleToggleFavorite}
                />
              }
            />
            <Route
              path="/cart"
              element={
                <Cart
                  cartItems={cartItems}
                  onIncrease={handleIncreaseCartItem}
                  onDecrease={handleDecreaseCartItem}
                  onRemove={handleRemoveCartItem}
                  currentUser={currentUser}
                  onClearCart={handleClearCart}
                />
              }
            />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/admin"
              element={
                isAdmin ? (
                  <Admin onLogout={handleLogout} />
                ) : (
                  <Navigate to="/login" replace state={{ from: "/admin" }} />
                )
              }
            />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

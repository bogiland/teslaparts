import {
  Edit2,
  Image as ImageIcon,
  LogOut,
  Plus,
  Save,
  Search,
  Trash2,
  UserCog,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import {
  categoryLabels,
  products as fallbackProducts,
  type Product,
} from "../data/products";
import { clearCurrentUser, getCurrentUser } from "../lib/auth";

type RoleName = "Администратор" | "Пользователь" | "Посетитель";

type RoleForm = {
  username: string;
  role: RoleName;
};

type AdminProps = {
  onLogout: () => void;
};

const emptyProductForm: Omit<Product, "id"> = {
  name: "",
  price: 0,
  category: "exterior",
  image: "",
  fallbackImage:
    "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80",
};

const emptyRoleForm: RoleForm = {
  username: "",
  role: "Администратор",
};

export default function Admin({ onLogout }: AdminProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] =
    useState<Omit<Product, "id">>(emptyProductForm);
  const [notice, setNotice] = useState<string | null>(null);
  const [roleForm, setRoleForm] = useState<RoleForm>(emptyRoleForm);
  const [roleLoading, setRoleLoading] = useState(false);

  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.role !== "Администратор") {
    return <Navigate to="/login" replace state={{ from: "/admin" }} />;
  }

  const authHeaders = (includeJson = false): HeadersInit => {
    const headers: Record<string, string> = {};

    if (includeJson) {
      headers["Content-Type"] = "application/json";
    }

    headers.Authorization = `Bearer ${currentUser.token}`;
    return headers;
  };

  const fetchProducts = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/products");
      if (!response.ok) {
        throw new Error("Failed to load products");
      }

      const data: Product[] = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Failed to load products:", error);
      setProducts(fallbackProducts);
      setNotice(
        "API is unavailable. Product list is shown from local fallback data.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchProducts();
  }, []);

  const filteredProducts = useMemo(
    () =>
      products.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [products, search],
  );

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      image: product.image,
      fallbackImage: product.fallbackImage,
    });
    setIsAdding(false);
  };

  const handleAddClick = () => {
    setEditingProduct(null);
    setFormData(emptyProductForm);
    setIsAdding(true);
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setIsAdding(false);
    setFormData(emptyProductForm);
  };

  const handleSignOut = () => {
    clearCurrentUser();
    onLogout();
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.image.trim()) {
      setNotice("Fill in product name and image path before saving.");
      return;
    }

    setNotice(null);

    try {
      if (isAdding) {
        const response = await fetch("/api/products", {
          method: "POST",
          headers: authHeaders(true),
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error("Create failed");
        }
      } else if (editingProduct) {
        const response = await fetch(`/api/products/${editingProduct.id}`, {
          method: "PUT",
          headers: authHeaders(true),
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error("Update failed");
        }
      }

      await fetchProducts();
      handleCancel();
      setNotice("Changes saved.");
    } catch (error) {
      console.error("Save failed:", error);
      setNotice("Could not save changes. Your session may have expired.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this product?")) {
      return;
    }

    setNotice(null);

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      await fetchProducts();
      if (editingProduct?.id === id) {
        handleCancel();
      }
      setNotice("Product deleted.");
    } catch (error) {
      console.error("Delete failed:", error);
      setNotice("Could not delete product.");
    }
  };

  const handleAssignRole = async () => {
    if (!roleForm.username.trim()) {
      setNotice("Enter a username to update role.");
      return;
    }

    setRoleLoading(true);
    setNotice(null);

    try {
      const response = await fetch(`/api/roles/users/${roleForm.username}`, {
        method: "PUT",
        headers: authHeaders(true),
        body: JSON.stringify(roleForm),
      });

      if (!response.ok) {
        throw new Error("Role update failed");
      }

      setNotice(`Role updated for ${roleForm.username}.`);
      setRoleForm(emptyRoleForm);
    } catch (error) {
      console.error("Role update failed:", error);
      setNotice("Could not update role. Make sure the user exists.");
    } finally {
      setRoleLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 pt-24 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Admin Panel</h1>
          <p className="mt-2 text-zinc-500">
            Only authenticated administrators can manage products and roles.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>

          <button
            type="button"
            onClick={handleAddClick}
            className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-white transition-colors hover:bg-zinc-800"
          >
            <Plus className="h-5 w-5" />
            Add product
          </button>
        </div>
      </div>

      {notice && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800">
          {notice}
        </div>
      )}

      <div className="mb-8 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <UserCog className="h-5 w-5 text-zinc-500" />
          <h2 className="text-lg font-semibold text-zinc-900">
            Role management
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_180px_auto]">
          <input
            type="text"
            value={roleForm.username}
            onChange={(event) =>
              setRoleForm({ ...roleForm, username: event.target.value })
            }
            placeholder="Existing username"
            className="rounded-lg border border-zinc-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <select
            value={roleForm.role}
            onChange={(event) =>
              setRoleForm({
                ...roleForm,
                role: event.target.value as RoleName,
              })
            }
            className="rounded-lg border border-zinc-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="Администратор">Администратор</option>
            <option value="Пользователь">Пользователь</option>
            <option value="Посетитель">Посетитель</option>
          </select>
          <button
            type="button"
            onClick={handleAssignRole}
            disabled={roleLoading}
            className="rounded-lg bg-zinc-900 px-4 py-2 font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {roleLoading ? "Saving..." : "Update role"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="flex min-h-[38rem] flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm lg:col-span-1">
          <div className="border-b border-zinc-200 bg-zinc-50 p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full rounded-lg border border-zinc-300 py-2 pl-10 pr-4 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <p className="py-10 text-center text-zinc-500">
                No products found.
              </p>
            ) : (
              <div className="space-y-1">
                {filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => handleEditClick(product)}
                    className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors ${
                      editingProduct?.id === product.id
                        ? "border-emerald-200 bg-emerald-50"
                        : "border-transparent hover:bg-zinc-50"
                    }`}
                  >
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded bg-zinc-100">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover"
                        onError={(event) => {
                          event.currentTarget.src = product.fallbackImage;
                        }}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-medium text-zinc-900">
                        {product.name}
                      </h3>
                      <p className="text-sm text-zinc-500">${product.price}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          {editingProduct || isAdding ? (
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between border-b border-zinc-100 pb-4">
                <h2 className="text-xl font-semibold text-zinc-900">
                  {isAdding ? "New product" : "Edit product"}
                </h2>
                <div className="flex gap-2">
                  {!isAdding && editingProduct && (
                    <button
                      type="button"
                      onClick={() => handleDelete(editingProduct.id)}
                      className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50"
                      title="Delete"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-100"
                    title="Close"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-zinc-700">
                      Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(event) =>
                        setFormData({ ...formData, name: event.target.value })
                      }
                      className="w-full rounded-lg border border-zinc-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-zinc-700">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.price}
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          price: Number(event.target.value),
                        })
                      }
                      className="w-full rounded-lg border border-zinc-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-zinc-700">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        category: event.target.value as Product["category"],
                      })
                    }
                    className="w-full rounded-lg border border-zinc-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="exterior">{categoryLabels.exterior}</option>
                    <option value="interior">{categoryLabels.interior}</option>
                    <option value="electronics">
                      {categoryLabels.electronics}
                    </option>
                    <option value="accessories">
                      {categoryLabels.accessories}
                    </option>
                    <option value="maintenance">
                      {categoryLabels.maintenance}
                    </option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-zinc-700">
                    Local image path
                  </label>
                  <div className="relative">
                    <ImageIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(event) =>
                        setFormData({ ...formData, image: event.target.value })
                      }
                      placeholder="/images/my-image.jpg"
                      className="w-full rounded-lg border border-zinc-300 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-zinc-700">
                    Fallback image URL
                  </label>
                  <input
                    type="text"
                    value={formData.fallbackImage}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        fallbackImage: event.target.value,
                      })
                    }
                    placeholder="https://images.unsplash.com/..."
                    className="w-full rounded-lg border border-zinc-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex justify-end gap-3 border-t border-zinc-100 pt-6">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="rounded-lg border border-zinc-300 px-6 py-2 text-zinc-700 transition-colors hover:bg-zinc-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-2 text-white transition-colors hover:bg-emerald-700"
                  >
                    <Save className="h-4 w-4" />
                    Save
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full min-h-[24rem] flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
                <Edit2 className="h-8 w-8 text-zinc-400" />
              </div>
              <h3 className="mb-2 text-lg font-medium text-zinc-900">
                Choose a product to edit
              </h3>
              <p className="max-w-sm text-zinc-500">
                Select a product on the left to update it or start a new one.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

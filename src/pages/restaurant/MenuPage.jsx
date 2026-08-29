import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  X,
  Upload,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useMyRestaurant,
  useMyMenu,
  useAddMenuItem,
  useUpdateMenuItem,
  useDeleteMenuItem,
} from "../../hooks/restaurantQueries";
import { uploadService } from "../../services/upload";
import { formatTZS } from "../../lib/format";
import FoodImage from "../../components/app/FoodImage";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  image: "",
  isAvailable: true,
  isPopular: false,
};

export default function MenuPage() {
  const { data: restaurant } = useMyRestaurant();
  const { data: menu = [], isLoading } = useMyMenu(restaurant?.id);
  const addMenuItem = useAddMenuItem();
  const updateMenuItem = useUpdateMenuItem();
  const deleteMenuItem = useDeleteMenuItem();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const categoryOptions = useMemo(() => {
    const fromMenu = menu.map((m) => m.category).filter(Boolean);
    return Array.from(new Set(fromMenu));
  }, [menu]);

  const grouped = useMemo(() => {
    const map = new Map();
    for (const item of menu) {
      const cat = item.category || "Uncategorized";
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat).push(item);
    }
    return Array.from(map.entries());
  }, [menu]);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      name: item.name || "",
      description: item.description || "",
      price: item.price ?? "",
      category: item.category || "",
      image: item.image || "",
      isAvailable: item.isAvailable !== false,
      isPopular: Boolean(item.isPopular),
    });
    setError("");
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const url = await uploadService.uploadImage(file, "menu");
      setForm((f) => ({ ...f, image: url }));
    } catch (err) {
      setError(err?.message || "Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) {
      setError("Meal name is required.");
      return;
    }
    if (!form.category.trim()) {
      setError("Category is required.");
      return;
    }
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price) || 0,
      category: form.category.trim(),
      image: form.image,
      isAvailable: form.isAvailable,
      isPopular: form.isPopular,
    };
    try {
      if (editing) {
        await updateMenuItem.mutateAsync({ menuId: editing.id, payload });
      } else {
        await addMenuItem.mutateAsync({ restaurantId: restaurant.id, payload });
      }
      setModalOpen(false);
    } catch (err) {
      setError(err?.message || "Something went wrong. Please try again.");
    }
  };

  const handleToggleAvailable = async (item) => {
    try {
      await updateMenuItem.mutateAsync({
        menuId: item.id,
        payload: { isAvailable: item.isAvailable === false },
      });
    } catch (err) {
      setError(err?.message || "Failed to update availability.");
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete "${item.name}"? This cannot be undone.`)) return;
    try {
      await deleteMenuItem.mutateAsync(item.id);
    } catch (err) {
      setError(err?.message || "Failed to delete item.");
    }
  };

  const saving = addMenuItem.isPending || updateMenuItem.isPending;

  if (restaurant === null) {
    return (
      <div className="bg-white border border-gray-100 py-20 text-center">
        <p className="text-lg font-semibold text-dark">No restaurant yet</p>
        <p className="text-sm text-gray-400 mt-1 mb-5">
          Create your restaurant before adding meals.
        </p>
        <Link
          to="/restaurant/setup"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors duration-200 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Set up restaurant
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-dark font-[family-name:var(--font-heading)]">Menu</h2>
          <p className="text-sm text-gray-400">Add meals by category and manage availability.</p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors duration-200 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add meal
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2">{error}</p>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : menu.length === 0 ? (
        <div className="bg-white border border-gray-100 py-20 text-center">
          <p className="text-lg font-semibold text-dark">No meals yet</p>
          <p className="text-sm text-gray-400 mt-1 mb-5">Add your first meal to start selling.</p>
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors duration-200 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add meal
          </button>
        </div>
      ) : (
        grouped.map(([cat, items]) => (
          <section key={cat} className="bg-white border border-gray-100">
            <h3 className="px-5 py-3 border-b border-gray-100 font-bold text-dark font-[family-name:var(--font-heading)]">
              {cat}
            </h3>
            <ul className="divide-y divide-gray-100">
              {items.map((item) => (
                <li key={item.id} className="flex items-center gap-4 px-5 py-3">
                  <div className="w-12 h-12 bg-gray-100 overflow-hidden shrink-0">
                    {item.image ? (
                      <FoodImage src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : null}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-dark truncate">{item.name}</p>
                    <p className="text-xs text-gray-400 truncate">
                      {formatTZS(item.price)}
                      {item.isPopular ? " · Popular" : ""}
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggleAvailable(item)}
                    title={item.isAvailable === false ? "Mark available" : "Mark unavailable"}
                    className="text-gray-400 hover:text-primary transition-colors cursor-pointer"
                  >
                    {item.isAvailable === false ? (
                      <ToggleLeft className="w-6 h-6" />
                    ) : (
                      <ToggleRight className="w-6 h-6 text-primary" />
                    )}
                  </button>
                  <button
                    onClick={() => openEdit(item)}
                    className="text-gray-400 hover:text-dark transition-colors cursor-pointer"
                    aria-label="Edit"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                    aria-label="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}

      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-[80]"
              onClick={() => setModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center p-0 sm:p-4"
            >
              <div className="bg-white w-full max-w-lg max-h-[92vh] overflow-y-auto">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white">
                  <h3 className="text-lg font-bold text-dark font-[family-name:var(--font-heading)]">
                    {editing ? "Edit meal" : "Add meal"}
                  </h3>
                  <button
                    onClick={() => setModalOpen(false)}
                    className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 cursor-pointer"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5 text-dark" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-dark mb-1.5">Meal name *</label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="e.g. Chips Mayai"
                      className="w-full px-4 py-3 border border-gray-200 focus:border-primary focus:outline-none text-sm bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-dark mb-1.5">Category *</label>
                      <input
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        list="category-options"
                        placeholder="e.g. Main, Drinks, Dessert"
                        className="w-full px-4 py-3 border border-gray-200 focus:border-primary focus:outline-none text-sm bg-white"
                      />
                      <datalist id="category-options">
                        {categoryOptions.map((c) => (
                          <option key={c} value={c} />
                        ))}
                      </datalist>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-dark mb-1.5">Price (TZS) *</label>
                      <input
                        name="price"
                        type="number"
                        min="0"
                        value={form.price}
                        onChange={handleChange}
                        placeholder="6000"
                        className="w-full px-4 py-3 border border-gray-200 focus:border-primary focus:outline-none text-sm bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark mb-1.5">Description</label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      rows={2}
                      placeholder="Short description"
                      className="w-full px-4 py-3 border border-gray-200 focus:border-primary focus:outline-none text-sm bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark mb-1.5">Image</label>
                    <div className="flex items-center gap-3">
                      <input
                        name="image"
                        value={form.image}
                        onChange={handleChange}
                        placeholder="Image URL"
                        className="flex-1 w-full px-4 py-3 border border-gray-200 focus:border-primary focus:outline-none text-sm bg-white"
                      />
                      <label className="shrink-0 inline-flex items-center gap-2 px-4 py-3 border border-gray-200 text-sm font-medium text-dark hover:bg-gray-50 cursor-pointer">
                        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                        Upload
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                      </label>
                    </div>
                    {form.image && (
                      <div className="mt-3 w-20 h-20 bg-gray-100 overflow-hidden">
                        <img src={form.image} alt="preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 text-sm text-dark cursor-pointer">
                      <input
                        type="checkbox"
                        name="isAvailable"
                        checked={form.isAvailable}
                        onChange={handleChange}
                        className="w-4 h-4 accent-primary"
                      />
                      Available
                    </label>
                    <label className="flex items-center gap-2 text-sm text-dark cursor-pointer">
                      <input
                        type="checkbox"
                        name="isPopular"
                        checked={form.isPopular}
                        onChange={handleChange}
                        className="w-4 h-4 accent-primary"
                      />
                      Mark as popular
                    </label>
                  </div>

                  {error && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2">{error}</p>
                  )}

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={saving || uploading}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold hover:bg-primary-dark transition-colors duration-200 cursor-pointer disabled:opacity-60"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" /> Saving...
                        </>
                      ) : editing ? (
                        "Save changes"
                      ) : (
                        "Add meal"
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalOpen(false)}
                      className="px-5 py-3 text-sm font-semibold text-gray-500 hover:text-dark cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

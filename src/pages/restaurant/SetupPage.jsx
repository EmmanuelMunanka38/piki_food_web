import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Store, Upload, ImagePlus } from "lucide-react";
import {
  useMyRestaurant,
  useCreateRestaurant,
  useUpdateRestaurant,
} from "../../hooks/restaurantQueries";
import { uploadService } from "../../services/upload";

const FALLBACK_IMAGE = "/restu.png";

const empty = {
  name: "",
  cuisine: "",
  city: "",
  address: "",
  distance: "0 km",
  deliveryTime: "30-45 min",
  deliveryFee: 0,
  description: "",
  image: "",
};

function toForm(restaurant) {
  if (!restaurant) return empty;
  return {
    name: restaurant.name || "",
    cuisine: restaurant.cuisine || "",
    city: restaurant.city || restaurant.location || "",
    address: restaurant.address || "",
    distance: restaurant.distance || "0 km",
    deliveryTime: restaurant.deliveryTime || "30-45 min",
    deliveryFee: restaurant.deliveryFee || 0,
    description: restaurant.description || "",
    image: restaurant.image || "",
  };
}

export default function SetupPage() {
  const { data: restaurant, isLoading } = useMyRestaurant();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32 text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <RestaurantSetupForm
      key={restaurant?.id || "new"}
      restaurant={restaurant}
    />
  );
}

function RestaurantSetupForm({ restaurant }) {
  const navigate = useNavigate();
  const createRestaurant = useCreateRestaurant();
  const updateRestaurant = useUpdateRestaurant();
  const [form, setForm] = useState(() => toForm(restaurant));
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm((f) => ({ ...f, [name]: type === "number" ? Number(value) : value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const url = await uploadService.uploadImage(file, "restaurant");
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
      setError("Restaurant name is required.");
      return;
    }
    const payload = {
      ...form,
      name: form.name.trim(),
      image: form.image.trim() || FALLBACK_IMAGE,
      deliveryFee: Number(form.deliveryFee) || 0,
      isOpen: restaurant ? restaurant.isOpen : false,
    };
    try {
      if (restaurant) {
        await updateRestaurant.mutateAsync({ id: restaurant.id, payload });
      } else {
        await createRestaurant.mutateAsync(payload);
      }
      navigate("/restaurant", { replace: true });
    } catch (err) {
      setError(err?.message || "Something went wrong. Please try again.");
    }
  };

  const submitting = createRestaurant.isPending || updateRestaurant.isPending;

  const inputClass =
    "w-full px-4 py-3 border border-gray-200 focus:border-primary focus:outline-none transition-colors duration-200 text-sm bg-white";
  const labelClass = "block text-sm font-medium text-dark mb-1.5";

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 bg-primary-light flex items-center justify-center">
          <Store className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-dark font-[family-name:var(--font-heading)]">
            {restaurant ? "Edit restaurant" : "Create your restaurant"}
          </h2>
          <p className="text-sm text-gray-400">
            {restaurant
              ? "Update your restaurant details."
              : "Add your restaurant name and details to get listed on Piki Food."}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-100 p-6 space-y-5">
        <div>
          <label className={labelClass}>Restaurant name *</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Mama Ntilie Restaurant"
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Cuisine type</label>
            <input
              name="cuisine"
              value={form.cuisine}
              onChange={handleChange}
              placeholder="e.g. Tanzanian, BBQ"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>City</label>
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="e.g. Dar es Salaam"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Address</label>
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Street, area"
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className={labelClass}>Delivery time</label>
            <input
              name="deliveryTime"
              value={form.deliveryTime}
              onChange={handleChange}
              placeholder="e.g. 30-45 min"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Delivery distance *</label>
            <input
              name="distance"
              value={form.distance}
              onChange={handleChange}
              placeholder="e.g. 2.5 km"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Delivery fee (TZS)</label>
            <input
              name="deliveryFee"
              type="number"
              min="0"
              value={form.deliveryFee}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            placeholder="Tell customers about your restaurant"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Restaurant image</label>
          <div className="flex items-center gap-3">
            <input
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="Image URL"
              className={`${inputClass} flex-1`}
            />
            <label className="shrink-0 inline-flex items-center gap-2 px-4 py-3 border border-gray-200 text-sm font-medium text-dark hover:bg-gray-50 cursor-pointer">
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              Upload
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>
          {form.image && (
            <div className="mt-3 w-24 h-24 bg-gray-100 overflow-hidden">
              <img src={form.image} alt="preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2">{error}</p>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting || uploading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold hover:bg-primary-dark transition-colors duration-200 cursor-pointer disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <ImagePlus className="w-4 h-4" />
                {restaurant ? "Save changes" : "Create restaurant"}
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate("/restaurant")}
            className="px-5 py-3 text-sm font-semibold text-gray-500 hover:text-dark transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

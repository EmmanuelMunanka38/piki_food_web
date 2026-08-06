import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  Clock,
  Bike,
  MapPin,
  Loader2,
  AlertTriangle,
  Store,
} from "lucide-react";
import { useRestaurant } from "../../hooks/queries";
import { useCartStore } from "../../store/cartStore";
import { formatTZS } from "../../lib/format";
import FoodImage from "../../components/app/FoodImage";
import MenuItemCard from "../../components/app/MenuItemCard";

export default function RestaurantPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: restaurant, isLoading, error } = useRestaurant(id);
  const [category, setCategory] = useState("");

  const setDeliveryFee = useCartStore((s) => s.setDeliveryFee);
  const setServiceFee = useCartStore((s) => s.setServiceFee);
  const setRestaurantName = useCartStore((s) => s.setRestaurantName);

  useEffect(() => {
    if (restaurant) {
      setDeliveryFee(restaurant.deliveryFee);
      setServiceFee(Math.round((Number(restaurant.deliveryFee) || 0) * 0.1));
      setRestaurantName(restaurant.name);
    }
  }, [restaurant, setDeliveryFee, setServiceFee, setRestaurantName]);

  const menu = useMemo(() => restaurant?.menu || [], [restaurant]);

  const categories = useMemo(() => {
    const seen = new Set();
    const list = [];
    for (const m of menu) {
      if (!seen.has(m.category)) {
        seen.add(m.category);
        list.push(m.category);
      }
    }
    return list;
  }, [menu]);

  const filteredMenu = category
    ? menu.filter((m) => m.category === category)
    : menu;

  const popularItems = useMemo(
    () => menu.filter((m) => m.isPopular).slice(0, 6),
    [menu]
  );

  if (isLoading) {
    return (
      <div className="py-24 flex flex-col items-center gap-3 text-gray-400">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p className="text-sm">Loading restaurant...</p>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="py-24 text-center">
        <Store className="w-12 h-12 mx-auto text-gray-300 mb-3" />
        <p className="text-lg font-semibold text-dark">Restaurant not found</p>
        <Link
          to="/app"
          className="inline-block mt-4 px-5 py-2.5 bg-primary text-white text-sm font-semibold hover:bg-primary-dark"
        >
          Browse restaurants
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-32">
      <div className="relative overflow-hidden mb-6 h-64 md:h-80">
        <FoodImage
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors cursor-pointer"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 text-dark" />
        </button>
        <div className="absolute bottom-4 left-5 right-5">
          <h1 className="text-2xl md:text-3xl font-bold text-white font-[family-name:var(--font-heading)]">
            {restaurant.name}
          </h1>
          <p className="text-white/80 text-sm mt-1">{restaurant.cuisine}</p>
        </div>
      </div>

      {!restaurant.isOpen && (
        <div className="mb-6 bg-amber-50 border border-amber-200 px-4 py-3 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-700">
              This restaurant is currently closed
            </p>
            {restaurant.customMessage && (
              <p className="text-xs text-amber-600 mt-0.5">{restaurant.customMessage}</p>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 mb-8">
        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-sm text-dark/80">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          {Number(restaurant.rating).toFixed(1)} ({restaurant.ratingCount})
        </span>
        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-sm text-dark/80">
          <Clock className="w-4 h-4 text-primary" /> {restaurant.deliveryTime}
        </span>
        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-sm text-dark/80">
          <Bike className="w-4 h-4 text-primary" />
          {restaurant.deliveryFee === 0 ? "Free delivery" : `Delivery ${formatTZS(restaurant.deliveryFee)}`}
        </span>
        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-sm text-dark/80">
          <MapPin className="w-4 h-4 text-primary" /> {restaurant.address}
        </span>
      </div>

      {popularItems.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-bold text-dark mb-4 font-[family-name:var(--font-heading)]">
            Popular Items
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {popularItems.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-5 -mx-4 px-4 md:mx-0 md:px-0">
          <button
            onClick={() => setCategory("")}
            className={`shrink-0 px-4 py-2 text-sm font-semibold transition-colors duration-200 cursor-pointer ${
              !category
                ? "bg-primary text-white"
                : "bg-white text-dark/70 border border-gray-200 hover:border-primary hover:text-primary"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(category === cat ? "" : cat)}
              className={`shrink-0 px-4 py-2 text-sm font-semibold transition-colors duration-200 cursor-pointer ${
                category === cat
                  ? "bg-primary text-white"
                  : "bg-white text-dark/70 border border-gray-200 hover:border-primary hover:text-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filteredMenu.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <p className="text-lg font-semibold text-dark">No items in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredMenu.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

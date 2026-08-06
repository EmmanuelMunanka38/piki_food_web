import { useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  Loader2,
  ArrowRight,
  Tag,
  Star,
  MapPin,
  X,
} from "lucide-react";
import { useRestaurants, useFeaturedRestaurants, useCategories, usePromotions, usePopularFoods, useFoodSearch } from "../../hooks/queries";
import { useAuthStore } from "../../store/authStore";
import { greeting } from "../../lib/format";
import RestaurantCard from "../../components/app/RestaurantCard";
import MenuItemCard from "../../components/app/MenuItemCard";
import FoodImage from "../../components/app/FoodImage";

export default function BrowsePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const user = useAuthStore((s) => s.user);
  const [selectedCategory, setSelectedCategory] = useState("");

  const restaurants = useRestaurants();
  const featured = useFeaturedRestaurants();
  const categories = useCategories();
  const promotions = usePromotions();
  const popular = usePopularFoods(8);
  const foodSearch = useFoodSearch(q);

  const isLoading = restaurants.isLoading || categories.isLoading;

  const filteredRestaurants = useMemo(() => {
    let list = restaurants.data || [];
    if (selectedCategory) {
      list = list.filter((r) => {
        const cats = Array.isArray(r.categories) ? r.categories : [r.cuisine];
        return cats.some((c) => c.toLowerCase() === selectedCategory.toLowerCase());
      });
    }
    return list;
  }, [restaurants.data, selectedCategory]);

  const clearSearch = () => setSearchParams({});

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-dark font-[family-name:var(--font-heading)] tracking-tight">
            {greeting()}, {user?.name?.split(" ")[0] || "there"}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            What would you like to order today?
          </p>
        </div>
      </div>

      {q && (
        <div className="bg-primary-light border border-primary/20 px-4 py-3 flex items-center justify-between">
          <p className="text-sm text-primary-dark font-medium">
            Search results for "{q}"
          </p>
          <button
            onClick={clearSearch}
            className="flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-dark cursor-pointer"
          >
            <X className="w-4 h-4" /> Clear
          </button>
        </div>
      )}

      {q ? (
        <section>
          {foodSearch.isLoading ? (
            <div className="py-20 flex flex-col items-center gap-3 text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p className="text-sm">Searching foods...</p>
            </div>
          ) : (foodSearch.data || []).length === 0 ? (
            <div className="py-20 text-center">
              <Search className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-lg font-semibold text-dark">No results found</p>
              <p className="text-sm text-gray-500 mt-1">Try a different dish or restaurant name</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {foodSearch.data.map((item) => (
                <Link key={item.id} to={`/app/restaurant/${item.restaurantId}`}>
                  <MenuItemCard item={item} showRestaurant />
                </Link>
              ))}
            </div>
          )}
        </section>
      ) : (
        <>
          <section>
            <div className="flex items-center gap-3 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
              <button
                onClick={() => setSelectedCategory("")}
                className={`shrink-0 px-4 py-2 text-sm font-semibold transition-colors duration-200 cursor-pointer ${
                  !selectedCategory
                    ? "bg-primary text-white"
                    : "bg-white text-dark/70 border border-gray-200 hover:border-primary hover:text-primary"
                }`}
              >
                All
              </button>
              {(categories.data || []).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() =>
                    setSelectedCategory(selectedCategory === cat.name ? "" : cat.name)
                  }
                  className={`shrink-0 px-4 py-2 text-sm font-semibold transition-colors duration-200 cursor-pointer ${
                    selectedCategory === cat.name
                      ? "bg-primary text-white"
                      : "bg-white text-dark/70 border border-gray-200 hover:border-primary hover:text-primary"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </section>

          {promotions.data?.length > 0 && (
            <section>
              <div className="grid md:grid-cols-2 gap-5">
                {promotions.data.slice(0, 2).map((promo) => (
                  <motion.div
                    key={promo.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative overflow-hidden min-h-[180px] bg-dark group"
                  >
                    <FoodImage
                      src={promo.image}
                      alt={promo.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-30 transition-opacity duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
                    <div className="relative z-10 p-6 flex flex-col justify-end h-full">
                      <span className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold uppercase tracking-wide mb-2">
                        <Tag className="w-3.5 h-3.5" /> Special Offer
                      </span>
                      <h3 className="text-xl font-bold text-white font-[family-name:var(--font-heading)]">
                        {promo.title}
                      </h3>
                      <p className="text-white/70 text-sm mt-1 line-clamp-2">
                        {promo.description}
                      </p>
                      {promo.restaurantId ? (
                        <Link
                          to={`/app/restaurant/${promo.restaurantId}`}
                          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-white text-dark text-sm font-semibold hover:bg-gray-100 transition-colors w-fit"
                        >
                          {promo.ctaLabel || "Order Now"} <ArrowRight className="w-4 h-4" />
                        </Link>
                      ) : (
                        <button
                          onClick={() => document.getElementById("restaurants")?.scrollIntoView({ behavior: "smooth" })}
                          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-white text-dark text-sm font-semibold hover:bg-gray-100 transition-colors w-fit cursor-pointer"
                        >
                          {promo.ctaLabel || "Order Now"} <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl md:text-2xl font-bold text-dark font-[family-name:var(--font-heading)]">
                Featured Restaurants
              </h2>
            </div>
            {(featured.data || []).length === 0 ? (
              <div className="py-10 text-center text-gray-400 text-sm">
                No featured restaurants yet
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {featured.data.map((r, i) => (
                  <RestaurantCard key={r.id} restaurant={r} index={i} />
                ))}
              </div>
            )}
          </section>

          {popular.data?.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl md:text-2xl font-bold text-dark font-[family-name:var(--font-heading)]">
                  Popular Dishes
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {popular.data.map((item) => (
                  <MenuItemCard key={item.id} item={item} showRestaurant />
                ))}
              </div>
            </section>
          )}

          <section id="restaurants">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl md:text-2xl font-bold text-dark font-[family-name:var(--font-heading)]">
                {selectedCategory ? `${selectedCategory} Restaurants` : "All Restaurants"}
              </h2>
              <span className="flex items-center gap-1.5 text-sm text-gray-500">
                <MapPin className="w-4 h-4 text-primary" />
                {selectedCategory ? "Filtered" : "Near you"}
              </span>
            </div>

            {isLoading ? (
              <div className="py-20 flex flex-col items-center gap-3 text-gray-400">
                <Loader2 className="w-8 h-8 animate-spin" />
                <p className="text-sm">Loading restaurants...</p>
              </div>
            ) : filteredRestaurants.length === 0 ? (
              <div className="py-16 text-center">
                <Star className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p className="text-lg font-semibold text-dark">No restaurants found</p>
                <p className="text-sm text-gray-500 mt-1">Try a different category</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredRestaurants.map((r, i) => (
                  <RestaurantCard key={r.id} restaurant={r} index={i} />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

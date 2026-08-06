import { api } from "../lib/api";

export const restaurantsService = {
  async getAll() {
    const res = await api.get("/restaurants");
    return res.data;
  },

  async getFeatured() {
    const res = await api.get("/restaurants/featured");
    return res.data;
  },

  async getById(id) {
    const res = await api.get(`/restaurants/${id}`);
    return res.data;
  },

  async getMenu(restaurantId, includeUnavailable = false) {
    const params = includeUnavailable ? "?includeUnavailable=true" : "";
    const res = await api.get(`/restaurants/${restaurantId}/menu${params}`);
    return res.data;
  },

  async getCategories() {
    const res = await api.get("/categories");
    return res.data;
  },

  async getPromotions() {
    const res = await api.get("/promotions");
    return res.data;
  },

  async fetchFoodItems(restaurants) {
    const queue = [...restaurants];
    const menuMap = new Map();
    const CONCURRENCY = 3;

    async function worker() {
      while (queue.length > 0) {
        const r = queue.shift();
        try {
          const menu = await restaurantsService.getMenu(r.id, true);
          menuMap.set(r.id, menu);
        } catch {
          menuMap.set(r.id, []);
        }
      }
    }

    await Promise.all(
      Array.from({ length: Math.min(CONCURRENCY, restaurants.length) }, () => worker())
    );

    const items = [];
    for (const r of restaurants) {
      for (const m of menuMap.get(r.id) || []) {
        items.push({ ...m, restaurant: r });
      }
    }
    return items;
  },

  async getPopularFoods(limit = 8) {
    let restaurants;
    try {
      restaurants = await this.getFeatured();
    } catch {
      restaurants = [];
    }
    if (restaurants.length === 0) {
      const all = await this.getAll();
      restaurants = all.slice(0, 5);
    }
    const items = await this.fetchFoodItems(restaurants);
    return items
      .sort((a, b) => Number(Boolean(b.isPopular)) - Number(Boolean(a.isPopular)))
      .slice(0, limit);
  },

  async searchFood(query) {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const restaurants = await this.getAll();
    const items = await this.fetchFoodItems(restaurants);
    return items.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        (m.description || "").toLowerCase().includes(q) ||
        m.restaurant.name.toLowerCase().includes(q) ||
        m.restaurant.cuisine.toLowerCase().includes(q)
    );
  },
};

import { api } from "../lib/api";

export const cartService = {
  async getCart() {
    const res = await api.get("/cart");
    return res.data;
  },

  async add(restaurantId, menuItemId, quantity = 1) {
    const res = await api.post("/cart/add", { restaurantId, menuItemId, quantity });
    return res.data;
  },

  async updateItem(itemId, quantity) {
    const res = await api.put(`/cart/items/${itemId}`, { quantity });
    return res.data;
  },

  async removeItem(itemId) {
    const res = await api.delete(`/cart/items/${itemId}`);
    return res.data;
  },

  async clear() {
    const res = await api.delete("/cart");
    return res.data;
  },
};

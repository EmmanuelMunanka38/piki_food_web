import { api } from "../lib/api";

export const restaurantOwnerService = {
  // Owner may have multiple restaurants; we use the first for this single-restaurant portal.
  getMyRestaurant(ownerId) {
    return api
      .get(`/restaurants?ownerId=${ownerId}`)
      .then((r) => (r.data || [])[0] || null);
  },

  getMenu(restaurantId) {
    return api
      .get(`/restaurants/${restaurantId}/menu?includeUnavailable=true`)
      .then((r) => r.data || []);
  },

  createRestaurant(payload) {
    return api.post("/restaurants", payload).then((r) => r.data);
  },

  updateRestaurant(id, payload) {
    return api.put(`/restaurants/${id}`, payload).then((r) => r.data);
  },

  addMenuItem(restaurantId, payload) {
    return api.post(`/restaurants/${restaurantId}/menu`, payload).then((r) => r.data);
  },

  updateMenuItem(menuId, payload) {
    return api.put(`/restaurants/menu/${menuId}`, payload).then((r) => r.data);
  },

  deleteMenuItem(menuId) {
    return api.delete(`/restaurants/menu/${menuId}`).then((r) => r.data);
  },

  getMyOrders() {
    return api.get("/orders").then((r) => r.data || []);
  },

  updateOrderStatus(id, status) {
    return api.put(`/orders/${id}/status`, { status }).then((r) => r.data);
  },

  getDashboard() {
    return api.get("/restaurant-owner/dashboard").then((r) => r.data);
  },
};

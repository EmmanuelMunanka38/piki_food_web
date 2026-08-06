import { api } from "../lib/api";

export const ordersService = {
  async placeOrder({ restaurantId, items, paymentMethod, deliveryAddress, specialInstructions }) {
    const res = await api.post("/orders", {
      restaurantId,
      items: items.map((i) => ({
        menuItemId: i.menuItemId,
        quantity: i.quantity,
        specialInstructions: i.specialInstructions,
      })),
      paymentMethod,
      deliveryAddress,
      specialInstructions,
    });
    return res.data;
  },

  async getHistory() {
    const res = await api.get("/orders");
    return res.data;
  },

  async getById(id) {
    const res = await api.get(`/orders/${id}`);
    return res.data;
  },

  async trackOrder(id) {
    const res = await api.get(`/orders/${id}/track`);
    return res.data;
  },

  async cancelOrder(id) {
    const res = await api.post(`/orders/${id}/cancel`);
    return res.data;
  },

  async reorder(orderId) {
    const res = await api.post(`/orders/${orderId}/reorder`);
    return res.data;
  },

  async deleteOrder(id) {
    const res = await api.delete(`/orders/${id}`);
    return res.data;
  },
};

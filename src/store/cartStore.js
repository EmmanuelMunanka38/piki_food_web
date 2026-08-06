import { create } from "zustand";
import { cartService } from "../services/cart";

export const useCartStore = create((set, get) => ({
  restaurantId: null,
  restaurantName: "",
  items: [],
  deliveryFee: 0,
  serviceFee: 0,
  isLoading: false,

  async loadCart() {
    set({ isLoading: true });
    try {
      const cart = await cartService.getCart();
      const items = (cart?.items || []).map((i) => ({
        ...i,
        menuItem: {
          id: i.menuItemId,
          name: i.name,
          price: i.price,
          image: null,
        },
      }));
      set({ items, restaurantId: cart?.restaurantId || null });
    } catch {
      // ignore — local cart still usable
    } finally {
      set({ isLoading: false });
    }
  },

  async addItem(menuItem, quantity = 1) {
    const { items, restaurantId } = get();
    const existing = items.find((i) => i.menuItemId === menuItem.id);
    if (existing) {
      const newQty = existing.quantity + quantity;
      set({
        items: items.map((i) =>
          i.menuItemId === menuItem.id ? { ...i, quantity: newQty } : i
        ),
      });
      if (!existing.id.startsWith("temp-")) {
        cartService.updateItem(existing.id, newQty).catch(() => {});
      }
      return;
    }

    const tempId = `temp-${Date.now()}`;
    const tempItem = {
      id: tempId,
      menuItemId: menuItem.id,
      menuItem,
      name: menuItem.name,
      price: menuItem.price,
      quantity,
    };

    set({
      items: [...items, tempItem],
      restaurantId: menuItem.restaurantId || restaurantId,
    });

    try {
      const cart = await cartService.add(menuItem.restaurantId, menuItem.id, quantity);
      const serverItems = cart?.items || [];
      const synced = serverItems.find((i) => i.menuItemId === menuItem.id);
      if (synced) {
        set({
          items: get().items.map((i) => (i.id === tempId ? { ...i, id: synced.id } : i)),
          restaurantId: cart?.restaurantId,
        });
      }
    } catch {
      // keep optimistic item locally
    }
  },

  async updateQty(itemId, quantity) {
    const items = get().items.map((i) =>
      i.id === itemId ? { ...i, quantity: Math.max(0, quantity) } : i
    );
    const updated = items.filter((i) => i.quantity > 0);
    set({ items: updated });
    if (itemId.startsWith("temp-")) return;
    if (quantity <= 0) {
      cartService.removeItem(itemId).catch(() => {});
    } else {
      cartService.updateItem(itemId, quantity).catch(() => {});
    }
  },

  removeItem(itemId) {
    set({ items: get().items.filter((i) => i.id !== itemId) });
    if (!itemId.startsWith("temp-")) {
      cartService.removeItem(itemId).catch(() => {});
    }
  },

  clearCart() {
    set({ items: [], restaurantId: null, restaurantName: "" });
    cartService.clear().catch(() => {});
  },

  setRestaurantName(name) {
    set({ restaurantName: name });
  },

  setDeliveryFee(fee) {
    set({ deliveryFee: Number(fee) || 0 });
  },

  setServiceFee(fee) {
    set({ serviceFee: Number(fee) || 0 });
  },

  itemCount() {
    return get().items.reduce((s, i) => s + i.quantity, 0);
  },

  subtotal() {
    return get().items.reduce((s, i) => s + i.quantity * i.price, 0);
  },

  total() {
    return get().subtotal() + get().deliveryFee + get().serviceFee;
  },
}));

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { restaurantOwnerService } from "../services/restaurantOwner";
import { useAuthStore } from "../store/authStore";

export const restaurantKeys = {
  me: ["restaurant-owner", "me"],
  menu: (restaurantId) => ["restaurant-owner", "menu", restaurantId],
  orders: ["restaurant-owner", "orders"],
};

export function useMyRestaurant() {
  const userId = useAuthStore((s) => s.user?.id);
  return useQuery({
    queryKey: restaurantKeys.me,
    queryFn: () => restaurantOwnerService.getMyRestaurant(userId),
    enabled: Boolean(userId),
  });
}

export function useMyMenu(restaurantId) {
  return useQuery({
    queryKey: restaurantKeys.menu(restaurantId),
    queryFn: () => restaurantOwnerService.getMenu(restaurantId),
    enabled: Boolean(restaurantId),
  });
}

export function useMyOrders() {
  return useQuery({
    queryKey: restaurantKeys.orders,
    queryFn: () => restaurantOwnerService.getMyOrders(),
    refetchInterval: 8000,
  });
}

export function useCreateRestaurant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => restaurantOwnerService.createRestaurant(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: restaurantKeys.me }),
  });
}

export function useUpdateRestaurant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => restaurantOwnerService.updateRestaurant(id, payload),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: restaurantKeys.me });
      if (data?.id) qc.invalidateQueries({ queryKey: restaurantKeys.menu(data.id) });
    },
  });
}

export function useAddMenuItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ restaurantId, payload }) =>
      restaurantOwnerService.addMenuItem(restaurantId, payload),
    onSuccess: (_data, vars) =>
      qc.invalidateQueries({ queryKey: restaurantKeys.menu(vars.restaurantId) }),
  });
}

export function useUpdateMenuItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ menuId, payload }) =>
      restaurantOwnerService.updateMenuItem(menuId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["restaurant-owner", "menu"] });
      qc.invalidateQueries({ queryKey: restaurantKeys.orders });
    },
  });
}

export function useDeleteMenuItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (menuId) => restaurantOwnerService.deleteMenuItem(menuId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["restaurant-owner", "menu"] });
    },
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => restaurantOwnerService.updateOrderStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: restaurantKeys.orders });
      qc.invalidateQueries({ queryKey: restaurantKeys.me });
    },
  });
}

import { useQuery } from "@tanstack/react-query";
import { restaurantsService } from "../services/restaurants";
import { ordersService } from "../services/orders";

export function useRestaurants() {
  return useQuery({ queryKey: ["restaurants"], queryFn: () => restaurantsService.getAll() });
}

export function useFeaturedRestaurants() {
  return useQuery({
    queryKey: ["restaurants", "featured"],
    queryFn: () => restaurantsService.getFeatured(),
  });
}

export function useCategories() {
  return useQuery({ queryKey: ["categories"], queryFn: () => restaurantsService.getCategories() });
}

export function usePromotions() {
  return useQuery({ queryKey: ["promotions"], queryFn: () => restaurantsService.getPromotions() });
}

export function useRestaurant(id) {
  return useQuery({
    queryKey: ["restaurants", id],
    queryFn: () => restaurantsService.getById(id),
    enabled: Boolean(id),
  });
}

export function useRestaurantMenu(id) {
  return useQuery({
    queryKey: ["restaurants", "menu", id],
    queryFn: () => restaurantsService.getMenu(id, true),
    enabled: Boolean(id),
  });
}

export function usePopularFoods(limit = 8) {
  return useQuery({
    queryKey: ["foods", "popular", limit],
    queryFn: () => restaurantsService.getPopularFoods(limit),
  });
}

export function useFoodSearch(query) {
  return useQuery({
    queryKey: ["foods", "search", query],
    queryFn: () => restaurantsService.searchFood(query),
    enabled: Boolean(query && query.trim().length >= 2),
  });
}

export function useOrders() {
  return useQuery({ queryKey: ["orders"], queryFn: () => ordersService.getHistory() });
}

export function useOrder(id, enabled = true) {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: () => ordersService.getById(id),
    enabled: Boolean(id) && enabled,
    refetchInterval: enabled ? 5000 : false,
  });
}

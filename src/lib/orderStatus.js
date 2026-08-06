export const ORDER_STEPS = [
  { key: "pending", label: "Order Placed" },
  { key: "restaurant_accepted", label: "Restaurant Accepted" },
  { key: "preparing", label: "Preparing" },
  { key: "ready_for_pickup", label: "Ready for Pickup" },
  { key: "driver_assigned", label: "Driver Assigned" },
  { key: "picked_up", label: "Picked Up" },
  { key: "on_the_way", label: "On the Way" },
  { key: "arrived", label: "Arrived" },
  { key: "delivered", label: "Delivered" },
];

export function getStepIndex(status) {
  const idx = ORDER_STEPS.findIndex((s) => s.key === status);
  return idx === -1 ? 0 : idx;
}

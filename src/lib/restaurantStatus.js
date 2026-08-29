export const OWNER_STATUS_META = {
  pending: { label: "Pending", className: "bg-amber-100 text-amber-700" },
  restaurant_accepted: { label: "Accepted", className: "bg-blue-100 text-blue-700" },
  preparing: { label: "Preparing", className: "bg-indigo-100 text-indigo-700" },
  ready_for_pickup: { label: "Ready", className: "bg-violet-100 text-violet-700" },
  driver_assigned: { label: "Driver assigned", className: "bg-cyan-100 text-cyan-700" },
  picked_up: { label: "Picked up", className: "bg-cyan-100 text-cyan-700" },
  on_the_way: { label: "On the way", className: "bg-cyan-100 text-cyan-700" },
  arrived: { label: "Arrived", className: "bg-cyan-100 text-cyan-700" },
  delivered: { label: "Delivered", className: "bg-green-100 text-green-700" },
  cancelled: { label: "Cancelled", className: "bg-red-100 text-red-700" },
  rejected: { label: "Rejected", className: "bg-red-100 text-red-700" },
};

export function statusMeta(status) {
  return OWNER_STATUS_META[status] || { label: status || "Unknown", className: "bg-gray-100 text-gray-700" };
}

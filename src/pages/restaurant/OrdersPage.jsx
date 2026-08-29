import { useState } from "react";
import { Loader2, Check, Phone, MapPin } from "lucide-react";
import { useMyOrders, useUpdateOrderStatus } from "../../hooks/restaurantQueries";
import { formatTZS, formatDate } from "../../lib/format";
import { statusMeta } from "../../lib/restaurantStatus";

const TABS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "active", label: "Active" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

const ACTIVE_STATUSES = [
  "restaurant_accepted",
  "preparing",
  "ready_for_pickup",
  "driver_assigned",
  "picked_up",
  "on_the_way",
  "arrived",
];

function nextActions(status) {
  switch (status) {
    case "pending":
      return [
        { label: "Accept", status: "restaurant_accepted", style: "bg-primary text-white hover:bg-primary-dark" },
      ];
    case "restaurant_accepted":
      return [{ label: "Start preparing", status: "preparing", style: "bg-primary text-white hover:bg-primary-dark" }];
    case "preparing":
      return [{ label: "Mark ready", status: "ready_for_pickup", style: "bg-primary text-white hover:bg-primary-dark" }];
    default:
      return [];
  }
}

function formatAddress(addr) {
  if (!addr) return "";
  if (typeof addr === "string") return addr;
  const parts = [addr.street, addr.area, addr.city].filter(Boolean);
  return [addr.label, parts.join(", ")].filter(Boolean).join(" · ");
}

export default function OrdersPage() {
  const { data: orders = [], isLoading } = useMyOrders();
  const updateStatus = useUpdateOrderStatus();
  const [tab, setTab] = useState("all");

  const filtered = orders.filter((o) => {
    if (tab === "all") return true;
    if (tab === "pending") return o.status === "pending";
    if (tab === "active") return ACTIVE_STATUSES.includes(o.status);
    if (tab === "completed") return o.status === "delivered";
    if (tab === "cancelled") return o.status === "cancelled";
    return true;
  });

  const counts = {
    pending: orders.filter((o) => o.status === "pending").length,
    active: orders.filter((o) => ACTIVE_STATUSES.includes(o.status)).length,
    completed: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  const handleAction = async (id, status) => {
    try {
      await updateStatus.mutateAsync({ id, status });
    } catch {
      // error surfaces via query cache; ignore local handling
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-dark font-[family-name:var(--font-heading)]">Orders</h2>
        <p className="text-sm text-gray-400">Accept orders and update their status.</p>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-b border-gray-100">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-sm font-semibold transition-colors duration-200 cursor-pointer border-b-2 -mb-px ${
              tab === t.key
                ? "text-primary border-primary"
                : "text-dark/60 hover:text-dark border-transparent"
            }`}
          >
            {t.label}
            {t.key !== "all" && counts[t.key] ? (
              <span className="ml-1.5 text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5">
                {counts[t.key]}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-gray-100 py-20 text-center">
          <p className="text-lg font-semibold text-dark">No orders here</p>
          <p className="text-sm text-gray-400 mt-1">New orders will appear automatically.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((o) => {
            const meta = statusMeta(o.status);
            const actions = nextActions(o.status);
            return (
              <div key={o.id} className="bg-white border border-gray-100 p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <p className="text-sm font-bold text-dark">
                      #{String(o.id).slice(0, 8)}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatDate(o.createdAt || o.created_at || o.date)}
                    </p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 ${meta.className}`}>
                    {meta.label}
                  </span>
                </div>

                <div className="space-y-1 mb-3">
                  {(o.items || []).map((it, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span className="text-dark">
                        {it.quantity || 1} × {it.name}
                      </span>
                      <span className="text-gray-400">{formatTZS(it.price)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <span className="font-semibold text-dark">{formatTZS(o.total)}</span>
                  <span className="flex items-center gap-3">
                    {o.user?.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5" /> {o.user.phone}
                      </span>
                    )}
                  </span>
                </div>

                {formatAddress(o.deliveryAddress) && (
                  <p className="flex items-start gap-1.5 text-xs text-gray-500 mb-3">
                    <MapPin className="w-4 h-4 shrink-0 text-gray-400" />
                    <span>{formatAddress(o.deliveryAddress)}</span>
                  </p>
                )}

                {actions.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
                    {actions.map((a) => (
                      <button
                        key={a.status}
                        onClick={() => handleAction(o.id, a.status)}
                        disabled={updateStatus.isPending}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold transition-colors duration-200 cursor-pointer disabled:opacity-60 ${a.style}`}
                      >
                        <Check className="w-4 h-4" />
                        {a.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

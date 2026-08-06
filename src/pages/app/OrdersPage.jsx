import { useState } from "react";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Receipt,
  Loader2,
  ArrowRight,
  RefreshCw,
  XCircle,
  Store,
  Trash2,
} from "lucide-react";
import { useOrders } from "../../hooks/queries";
import { ordersService } from "../../services/orders";
import { formatTZS, formatDate } from "../../lib/format";

const STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-600 border-amber-200",
  restaurant_accepted: "bg-blue-50 text-blue-600 border-blue-200",
  preparing: "bg-blue-50 text-blue-600 border-blue-200",
  ready_for_pickup: "bg-blue-50 text-blue-600 border-blue-200",
  driver_assigned: "bg-purple-50 text-purple-600 border-purple-200",
  picked_up: "bg-purple-50 text-purple-600 border-purple-200",
  on_the_way: "bg-purple-50 text-purple-600 border-purple-200",
  arrived: "bg-purple-50 text-purple-600 border-purple-200",
  delivered: "bg-green-50 text-green-600 border-green-200",
  cancelled: "bg-red-50 text-red-600 border-red-200",
};

const STATUS_LABELS = {
  pending: "Pending",
  restaurant_accepted: "Accepted",
  preparing: "Preparing",
  ready_for_pickup: "Ready for pickup",
  driver_assigned: "Driver assigned",
  picked_up: "Picked up",
  on_the_way: "On the way",
  arrived: "Arrived",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function OrdersPage() {
  const { data: orders, isLoading } = useOrders();
  const queryClient = useQueryClient();
  const [busyId, setBusyId] = useState(null);
  const [selected, setSelected] = useState([]);
  const [deleting, setDeleting] = useState(false);

  const validSelected = selected.filter((id) => orders?.some((o) => o.id === id));
  const allSelected = orders?.length > 0 && validSelected.length === orders.length;

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelected(allSelected ? [] : orders.map((o) => o.id));
  };

  const handleDeleteSelected = async () => {
    if (validSelected.length === 0) return;
    setDeleting(true);
    try {
      await Promise.all(validSelected.map((id) => ordersService.deleteOrder(id)));
      setSelected([]);
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    } catch {
      // ignore
    } finally {
      setDeleting(false);
    }
  };

  const handleCancel = async (id) => {
    setBusyId(id);
    try {
      await ordersService.cancelOrder(id);
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    } catch {
      // ignore
    } finally {
      setBusyId(null);
    }
  };

  const handleReorder = async (id) => {
    setBusyId(id);
    try {
      await ordersService.reorder(id);
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    } catch {
      // ignore
    } finally {
      setBusyId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 flex flex-col items-center gap-3 text-gray-400">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p className="text-sm">Loading your orders...</p>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="py-20 text-center">
        <Receipt className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold text-dark font-[family-name:var(--font-heading)]">
          No orders yet
        </h1>
        <p className="text-gray-500 text-sm mt-2 mb-6">
          When you place an order, it will show up here
        </p>
        <Link
          to="/app"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold hover:bg-primary-dark transition-colors"
        >
          <Store className="w-5 h-5" /> Order Food
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-dark font-[family-name:var(--font-heading)]">
          My Orders
        </h1>
      </div>

      <div className="flex items-center justify-between gap-3 mb-4">
        <label className="flex items-center gap-2 text-sm font-semibold text-dark cursor-pointer">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={toggleSelectAll}
            className="w-4 h-4 accent-primary cursor-pointer"
          />
          Select all
        </label>

        {validSelected.length > 0 && (
          <button
            onClick={handleDeleteSelected}
            disabled={deleting}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-60"
          >
            {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            Delete {validSelected.length} {validSelected.length === 1 ? "order" : "orders"}
          </button>
        )}
      </div>

      <div className="space-y-4">
        {orders.map((order, i) => {
          const canCancel = ["pending", "restaurant_accepted"].includes(order.status);
          const style = STATUS_STYLES[order.status] || STATUS_STYLES.pending;
          const busy = busyId === order.id;
          const isSelected = validSelected.includes(order.id);
          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`bg-white border shadow-sm p-5 transition-colors ${
                isSelected ? "border-primary bg-primary-light" : "border-gray-100"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelect(order.id)}
                    className="mt-1 w-4 h-4 accent-primary cursor-pointer"
                  />
                  <div>
                    <p className="font-bold text-dark font-[family-name:var(--font-heading)]">
                      {order.restaurant?.name || "Restaurant"}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      #{order.orderNumber?.replace("PIKI-", "") || order.id.slice(0, 6)} ·{" "}
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 text-xs font-semibold border ${style}`}>
                  {STATUS_LABELS[order.status] || order.status}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-3 line-clamp-1">
                {order.items?.map((it) => `${it.quantity}× ${it.name}`).join(", ")}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-3">
                <div className="flex items-center gap-4">
                  <span className="font-bold text-primary font-[family-name:var(--font-heading)]">
                    {formatTZS(order.total)}
                  </span>
                  <span className="text-xs text-gray-400 capitalize">
                    {order.paymentMethod?.replace(/_/g, " ")}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {canCancel && (
                    <button
                      onClick={() => handleCancel(order.id)}
                      disabled={busy}
                      className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-red-600 border border-red-200 hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-60"
                    >
                      {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                      Cancel
                    </button>
                  )}
                  {order.status === "delivered" && (
                    <button
                      onClick={() => handleReorder(order.id)}
                      disabled={busy}
                      className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-dark border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-60"
                    >
                      {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                      Reorder
                    </button>
                  )}
                  <Link
                    to={`/app/track/${order.id}`}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary-dark transition-colors"
                  >
                    Track <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

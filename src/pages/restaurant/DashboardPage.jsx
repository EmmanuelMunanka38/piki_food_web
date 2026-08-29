import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Store,
  UtensilsCrossed,
  Receipt,
  Wallet,
  Plus,
  ArrowRight,
  Loader2,
  Power,
  CreditCard,
} from "lucide-react";
import { useMyRestaurant, useMyMenu, useMyOrders, useUpdateRestaurant } from "../../hooks/restaurantQueries";
import { formatTZS } from "../../lib/format";
import { statusMeta } from "../../lib/restaurantStatus";
import FoodImage from "../../components/app/FoodImage";
import { useAuthStore } from "../../store/authStore";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { data: restaurant, isLoading: rLoading } = useMyRestaurant();
  const { data: menu = [] } = useMyMenu(restaurant?.id);
  const { data: orders = [] } = useMyOrders();
  const updateRestaurant = useUpdateRestaurant();
  const subscription = useAuthStore((s) => s.subscription);
  const [toggling, setToggling] = useState(false);

  const planName = subscription?.plan?.name || "Free Trial";
  const isTrial = subscription?.isTrial || false;
  const trialDaysLeft = isTrial ? Math.max(0, Math.ceil((new Date(subscription.trialEndsAt) - new Date()) / (1000 * 60 * 60 * 24))) : 0;

  if (rLoading) {
    return (
      <div className="flex items-center justify-center py-32 text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="py-16">
        <div className="max-w-xl mx-auto bg-white border border-gray-100 text-center px-8 py-14">
          <div className="w-16 h-16 bg-primary-light flex items-center justify-center mx-auto mb-5">
            <Store className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-dark mb-2 font-[family-name:var(--font-heading)]">
            Set up your restaurant
          </h2>
          <p className="text-gray-500 mb-8">
            You don't have a restaurant yet. Add your restaurant name and details to start
            accepting orders on Piki Food.
          </p>
          <Link
            to="/restaurant/setup"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold hover:bg-primary-dark transition-colors duration-200 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Create your restaurant
          </Link>
        </div>
      </div>
    );
  }

  const handleToggleOpen = async () => {
    setToggling(true);
    try {
      await updateRestaurant.mutateAsync({ id: restaurant.id, isOpen: !restaurant.isOpen });
    } finally {
      setToggling(false);
    }
  };

  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const todaysOrders = orders.filter((o) => {
    const d = new Date(o.createdAt || o.created_at || o.date);
    return d && d.toDateString() === new Date().toDateString();
  });
  const revenue = orders
    .filter((o) => o.status === "delivered")
    .reduce((sum, o) => sum + (Number(o.total) || 0), 0);

  const stats = [
    { label: "Menu items", value: menu.length, icon: UtensilsCrossed, to: "/restaurant/menu" },
    { label: "Pending orders", value: pendingOrders, icon: Receipt, to: "/restaurant/orders" },
    { label: "Orders today", value: todaysOrders.length, icon: Receipt, to: "/restaurant/orders" },
    { label: "Revenue (delivered)", value: formatTZS(revenue), icon: Wallet, to: null },
  ];

  const recentOrders = orders.slice(0, 5);
  const recentItems = menu.slice(0, 4);

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-100 p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-5">
        <div className="w-20 h-20 bg-gray-100 shrink-0 overflow-hidden">
          {restaurant.image ? (
            <FoodImage src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Store className="w-8 h-8 text-gray-300" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl md:text-2xl font-bold text-dark font-[family-name:var(--font-heading)] truncate">
            {restaurant.name}
          </h2>
          <p className="text-sm text-gray-400 mt-0.5">
            {[restaurant.cuisine, restaurant.city || restaurant.location, restaurant.address]
              .filter(Boolean)
              .join(" · ")}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold ${
              isTrial ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"
            }`}>
              <CreditCard className="w-3 h-3" />
              {planName}
            </span>
            {isTrial && trialDaysLeft > 0 && (
              <span className="text-xs text-amber-600">
                {trialDaysLeft} days left
              </span>
            )}
            <Link
              to="/restaurant/billing"
              className="text-xs text-primary hover:text-primary-dark font-semibold"
            >
              Manage
            </Link>
          </div>
        </div>
        <button
          onClick={handleToggleOpen}
          disabled={toggling}
          className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-colors duration-200 cursor-pointer ${
            restaurant.isOpen
              ? "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100"
              : "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200"
          }`}
        >
          {toggling ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Power className="w-4 h-4" />
          )}
          {restaurant.isOpen ? "Open" : "Closed"}
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const card = (
            <div className="bg-white border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-400">{s.label}</span>
                <s.icon className="w-5 h-5 text-primary" />
              </div>
              <p className="text-2xl font-bold text-dark font-[family-name:var(--font-heading)]">
                {s.value}
              </p>
            </div>
          );
          return s.to ? (
            <Link key={s.label} to={s.to} className="block hover:shadow-md transition-shadow duration-200">
              {card}
            </Link>
          ) : (
            <div key={s.label}>{card}</div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white border border-gray-100">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="font-bold text-dark font-[family-name:var(--font-heading)]">Recent orders</h3>
            <button
              onClick={() => navigate("/restaurant/orders")}
              className="text-sm font-semibold text-primary hover:text-primary-dark flex items-center gap-1 cursor-pointer"
            >
              View all <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          {recentOrders.length === 0 ? (
            <p className="px-5 py-10 text-center text-gray-400 text-sm">No orders yet.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {recentOrders.map((o) => (
                <li key={o.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-dark truncate">
                       #{String(o.id).slice(0, 8)} · {o.user?.name || "Customer"}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {o.items?.reduce((n, i) => n + (i.quantity || 1), 0) || 0} items ·{" "}
                      {formatTZS(o.total)}
                    </p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 ${statusMeta(o.status).className}`}>
                    {statusMeta(o.status).label}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="bg-white border border-gray-100">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="font-bold text-dark font-[family-name:var(--font-heading)]">Menu preview</h3>
            <button
              onClick={() => navigate("/restaurant/menu")}
              className="text-sm font-semibold text-primary hover:text-primary-dark flex items-center gap-1 cursor-pointer"
            >
              Manage <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          {recentItems.length === 0 ? (
            <p className="px-5 py-10 text-center text-gray-400 text-sm">No meals added yet.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {recentItems.map((m) => (
                <li key={m.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="w-10 h-10 bg-gray-100 overflow-hidden shrink-0">
                    {m.image ? (
                      <FoodImage src={m.image} alt={m.name} className="w-full h-full object-cover" />
                    ) : null}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-dark truncate">{m.name}</p>
                    <p className="text-xs text-gray-400 truncate">{m.category}</p>
                  </div>
                  <span className="text-sm font-semibold text-dark">{formatTZS(m.price)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

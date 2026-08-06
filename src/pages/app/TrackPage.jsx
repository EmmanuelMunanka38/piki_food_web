import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Map, { Marker } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  ArrowLeft,
  Loader2,
  MapPin,
  Store,
  Receipt,
  AlertTriangle,
  Package,
  XCircle,
} from "lucide-react";
import { useOrder } from "../../hooks/queries";
import { ordersService } from "../../services/orders";
import { useAuthStore } from "../../store/authStore";
import { formatTZS, formatDate } from "../../lib/format";
import { MAPBOX_TOKEN } from "../../data/mapConfig";
import { getStepIndex, ORDER_STEPS } from "../../lib/orderStatus";
import StatusTimeline from "../../components/app/StatusTimeline";

const DEFAULT_CENTER = [39.2083, -6.7924];

const STATUS_LABELS = {
  pending: "Order placed — waiting for confirmation",
  restaurant_accepted: "Restaurant accepted your order",
  preparing: "Your food is being prepared",
  ready_for_pickup: "Ready for pickup",
  driver_assigned: "Driver assigned",
  picked_up: "Driver picked up your order",
  on_the_way: "On the way to you",
  arrived: "Driver has arrived",
  delivered: "Delivered",
  cancelled: "Order cancelled",
};

async function geocodeAddress(address) {
  const q = [address?.street, address?.area, address?.city]
    .filter(Boolean)
    .join(", ");
  if (!q) return null;
  try {
    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        q
      )}.json?access_token=${MAPBOX_TOKEN}&country=TZ&limit=1`
    );
    const json = await res.json();
    const feat = json.features?.[0];
    if (feat) return feat.center; // [lng, lat]
  } catch {
    // ignore
  }
  return null;
}

export default function TrackPage() {
  const { id } = useParams();
  const user = useAuthStore((s) => s.user);
  const { data: order, isLoading } = useOrder(id, true);

  const [deliveryCoords, setDeliveryCoords] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (order?.deliveryAddress) {
      geocodeAddress(order.deliveryAddress).then(setDeliveryCoords);
    }
  }, [order?.deliveryAddress]);

  const restaurantCoords = useMemo(() => {
    if (order?.restaurant?.latitude && order?.restaurant?.longitude) {
      return [order.restaurant.longitude, order.restaurant.latitude];
    }
    return null;
  }, [order]);

  const mapView = useMemo(() => {
    const markers = [restaurantCoords, deliveryCoords].filter(Boolean);
    if (markers.length === 0) return { longitude: DEFAULT_CENTER[0], latitude: DEFAULT_CENTER[1], zoom: 12 };
    if (markers.length === 1) return { longitude: markers[0][0], latitude: markers[0][1], zoom: 13 };
    const lngs = markers.map((m) => m[0]);
    const lats = markers.map((m) => m[1]);
    return {
      longitude: (Math.min(...lngs) + Math.max(...lngs)) / 2,
      latitude: (Math.min(...lats) + Math.max(...lats)) / 2,
      zoom: 12,
    };
  }, [restaurantCoords, deliveryCoords]);

  const handleCancel = async () => {
    if (!order) return;
    setCancelling(true);
    try {
      await ordersService.cancelOrder(order.id);
    } catch {
      // ignore
    } finally {
      setCancelling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 flex flex-col items-center gap-3 text-gray-400">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p className="text-sm">Loading order...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-24 text-center">
        <Package className="w-12 h-12 mx-auto text-gray-300 mb-3" />
        <p className="text-lg font-semibold text-dark">Order not found</p>
        <Link to="/app/orders" className="inline-block mt-4 px-5 py-2.5 bg-primary text-white text-sm font-semibold">
          View my orders
        </Link>
      </div>
    );
  }

  const canCancel = ["pending", "restaurant_accepted"].includes(order.status);
  const activeStep = getStepIndex(order.status);
  const statusLabel = STATUS_LABELS[order.status] || order.status;

  return (
    <div className="pb-16">
      <Link
        to="/app/orders"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-dark transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> Back to orders
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-dark font-[family-name:var(--font-heading)]">
            Order #{order.orderNumber?.replace("PIKI-", "") || order.id.slice(0, 6)}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {formatDate(order.createdAt)} · {order.paymentMethod.replace(/_/g, " ")}
          </p>
        </div>
        {canCancel && (
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-red-600 border border-red-200 hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-60"
          >
            <XCircle className="w-4 h-4" />
            {cancelling ? "Cancelling..." : "Cancel Order"}
          </button>
        )}
      </div>

      <div className={`mb-6 px-4 py-3 flex items-center gap-3 border ${
        order.status === "cancelled"
          ? "bg-red-50 border-red-100"
          : order.status === "delivered"
          ? "bg-green-50 border-green-100"
          : "bg-primary-light border-primary/20"
      }`}>
        {order.status === "cancelled" ? (
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
        ) : (
          <span className="relative flex w-3 h-3 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full bg-primary opacity-60" />
            <span className="relative inline-flex h-3 w-3 bg-primary" />
          </span>
        )}
        <p className={`text-sm font-semibold ${
          order.status === "cancelled" ? "text-red-600" : "text-primary-dark"
        }`}>
          {statusLabel}
        </p>
        {order.estimatedDelivery && order.status !== "cancelled" && (
          <span className="ml-auto text-sm text-gray-500 hidden sm:block">
            ETA {formatDate(order.estimatedDelivery)}
          </span>
        )}
      </div>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6 items-start">
        <div className="space-y-6">
          <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
              <span className="font-bold text-dark">Live Tracking</span>
              <span className="text-xs text-gray-400">Auto-updates every 5s</span>
            </div>
            <div className="relative" style={{ height: "360px" }}>
              <Map
                initialViewState={mapView}
                style={{ width: "100%", height: "100%" }}
                mapStyle="mapbox://styles/mapbox/streets-v12"
                mapboxAccessToken={MAPBOX_TOKEN}
                attributionControl={false}
              >
                {restaurantCoords && (
                  <Marker longitude={restaurantCoords[0]} latitude={restaurantCoords[1]} anchor="bottom">
                    <div className="relative flex flex-col items-center">
                      <div className="w-10 h-10 bg-dark flex items-center justify-center shadow-lg">
                        <Store className="w-5 h-5 text-white" />
                      </div>
                      <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-dark" />
                    </div>
                  </Marker>
                )}
                {deliveryCoords && (
                  <Marker longitude={deliveryCoords[0]} latitude={deliveryCoords[1]} anchor="bottom">
                    <div className="relative flex flex-col items-center">
                      <div className="w-10 h-10 bg-primary flex items-center justify-center shadow-lg">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-primary" />
                    </div>
                  </Marker>
                )}
              </Map>
              <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 text-[11px] text-gray-600 shadow-sm border border-gray-100">
                {order.status === "delivered"
                  ? "Delivered"
                  : `${ORDER_STEPS[activeStep]?.label || "Order"} · ${activeStep}/${ORDER_STEPS.length - 1}`}
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-5">
              <Receipt className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-dark font-[family-name:var(--font-heading)]">
                Order Progress
              </h2>
            </div>
            <StatusTimeline status={order.status} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary-light flex items-center justify-center overflow-hidden">
                <Store className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-bold text-dark">{order.restaurant?.name}</p>
                <p className="text-xs text-gray-400">{order.restaurant?.address}</p>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-2 max-h-56 overflow-y-auto">
              {order.items?.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600 truncate pr-3">
                    {item.quantity} × {item.name}
                  </span>
                  <span className="font-semibold text-dark shrink-0">
                    {formatTZS(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-3 mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-semibold text-dark">{formatTZS(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Delivery</span>
                <span className="font-semibold text-dark">{formatTZS(order.deliveryFee)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Service</span>
                <span className="font-semibold text-dark">{formatTZS(order.serviceFee)}</span>
              </div>
              <div className="flex justify-between border-t border-gray-100 pt-2">
                <span className="font-bold text-dark">Total</span>
                <span className="font-bold text-primary">{formatTZS(order.total)}</span>
              </div>
            </div>
          </div>

          {order.rider && (
            <div className="bg-white border border-gray-100 shadow-sm p-5">
              <h3 className="font-bold text-dark mb-3 font-[family-name:var(--font-heading)]">
                Your Rider
              </h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary flex items-center justify-center text-white font-bold overflow-hidden">
                  {order.rider.avatar ? (
                    <img src={order.rider.avatar} alt={order.rider.name} className="w-full h-full object-cover" />
                  ) : (
                    order.rider.name.charAt(0)
                  )}
                </div>
                <div>
                  <p className="font-semibold text-dark">{order.rider.name}</p>
                  <p className="text-xs text-gray-400">
                    {order.rider.phone} · {order.rider.vehicle || "Delivery rider"}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white border border-gray-100 shadow-sm p-5">
            <h3 className="font-bold text-dark mb-2 font-[family-name:var(--font-heading)]">
              Delivering to
            </h3>
            <p className="text-sm text-gray-600">
              {order.deliveryAddress?.street}, {order.deliveryAddress?.area},{" "}
              {order.deliveryAddress?.city}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {user?.name} · {user?.phone || "Phone on file"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

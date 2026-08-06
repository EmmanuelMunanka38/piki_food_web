import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  MapPin,
  Smartphone,
  Banknote,
  CreditCard,
  ChevronRight,
  Loader2,
  ShoppingCart,
  Store,
  ArrowLeft,
  Check,
  LocateFixed,
  AlertTriangle,
} from "lucide-react";
import { useCartStore } from "../../store/cartStore";
import { ordersService } from "../../services/orders";
import { formatTZS } from "../../lib/format";
import { PAYMENT_METHODS } from "../../lib/payments";
import { detectAddress } from "../../lib/location";
import UsdPaymentModal from "../../components/app/UsdPaymentModal";
import OrderSuccess from "../../components/app/OrderSuccess";

const MOBILE_MONEY_ORDER = ["airtel_money", "mixx_by_yas", "halopesa", "mpesa"];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const restaurantId = useCartStore((s) => s.restaurantId);
  const restaurantName = useCartStore((s) => s.restaurantName);
  const deliveryFee = useCartStore((s) => s.deliveryFee);
  const serviceFee = useCartStore((s) => s.serviceFee);
  const clearCart = useCartStore((s) => s.clearCart);

  const [address, setAddress] = useState({
    label: "Home",
    street: "",
    area: "",
    city: "",
    isDefault: true,
  });
  const [paymentMethod, setPaymentMethod] = useState("");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [placedOrder, setPlacedOrder] = useState(null);

  const detectAndFill = useCallback(async () => {
    setLocating(true);
    setLocationError("");
    try {
      const detected = await detectAddress();
      setAddress((prev) => ({
        ...prev,
        label: detected.label,
        street: detected.street || prev.street,
        area: detected.area || prev.area,
        city: detected.city || prev.city,
      }));
    } catch (err) {
      setLocationError(err?.message || "Could not detect your location.");
    } finally {
      setLocating(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(detectAndFill, 0);
    return () => clearTimeout(t);
  }, [detectAndFill]);

  useEffect(() => {
    if (items.length === 0 && !placedOrder) {
      navigate("/app", { replace: true });
    }
  }, [items.length, placedOrder, navigate]);

  const subtotal = items.reduce((s, i) => s + i.quantity * i.price, 0);
  const total = subtotal + deliveryFee + serviceFee;

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!address.street.trim()) return "Please enter your street address.";
    if (!address.area.trim()) return "Please enter your area.";
    if (!address.city.trim()) return "Please enter your city.";
    if (!paymentMethod) return "Please select a payment method.";
    return "";
  };

  const handlePlaceOrder = async () => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setError("");
    const deliveryAddress = {
      label: address.label,
      street: address.street,
      area: address.area,
      city: address.city,
      isDefault: address.isDefault,
    };

    if (MOBILE_MONEY_ORDER.includes(paymentMethod)) {
      setModalOpen(true);
      return;
    }

    setPlacing(true);
    try {
      const order = await ordersService.placeOrder({
        restaurantId,
        items,
        paymentMethod: "cash",
        deliveryAddress,
      });
      clearCart();
      setPlacedOrder(order);
    } catch (err) {
      setError(err?.message || "Failed to place order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  const inputClass =
    "w-full px-3 py-2.5 border border-gray-200 focus:border-primary focus:outline-none transition-colors duration-200 text-sm bg-white";

  return (
    <>
      {placedOrder && <OrderSuccess order={placedOrder} />}

      <div className="max-w-4xl mx-auto pb-16">      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-dark transition-colors mb-4 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back to cart
      </button>

      <h1 className="text-2xl md:text-3xl font-bold text-dark font-[family-name:var(--font-heading)] mb-1">
        Checkout
      </h1>
      {restaurantName && (
        <p className="text-primary font-semibold text-sm mb-8">{restaurantName}</p>
      )}

      <div className="grid md:grid-cols-[1fr_340px] gap-6 items-start">
        <div className="space-y-6">
          <section className="bg-white border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                <h2 className="font-bold text-dark font-[family-name:var(--font-heading)]">
                  Delivery Address
                </h2>
              </div>
              <button
                type="button"
                onClick={detectAndFill}
                disabled={locating}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-primary border border-primary/30 hover:bg-primary-light transition-colors cursor-pointer disabled:opacity-60"
              >
                {locating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <LocateFixed className="w-4 h-4" />
                )}
                {locating ? "Detecting..." : "Use my location"}
              </button>
            </div>

            {locating && (
              <div className="mb-4 flex items-center gap-3 px-4 py-3 bg-primary-light border border-primary/20">
                <Loader2 className="w-5 h-5 animate-spin text-primary shrink-0" />
                <p className="text-sm font-medium text-primary-dark">
                  Detecting your current location...
                </p>
              </div>
            )}

            {locationError && !locating && (
              <div className="mb-4 flex items-start gap-3 px-4 py-3 bg-red-50 border border-red-100">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-600">
                    Could not detect your location
                  </p>
                  <p className="text-xs text-red-500 mt-0.5">
                    {locationError} You can enter your delivery address manually below.
                  </p>
                </div>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Label
                </label>
                <input
                  name="label"
                  value={address.label}
                  onChange={handleChange}
                  placeholder="Home / Work"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  City
                </label>
                <input
                  name="city"
                  value={address.city}
                  onChange={handleChange}
                  placeholder="e.g. Dar es Salaam"
                  className={inputClass}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Street Address
                </label>
                <input
                  name="street"
                  value={address.street}
                  onChange={handleChange}
                  placeholder="e.g. Chole Road, Plot 12"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Area
                </label>
                <input
                  name="area"
                  value={address.area}
                  onChange={handleChange}
                  placeholder="e.g. Masaki"
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          <section className="bg-white border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Smartphone className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-dark font-[family-name:var(--font-heading)]">
                Payment Method
              </h2>
            </div>

            <div className="space-y-2.5">
              {Object.entries(PAYMENT_METHODS).map(([key, method]) => {
                const isSelected = paymentMethod === key;
                const Icon = method.ussd
                  ? Smartphone
                  : key === "cash"
                  ? Banknote
                  : CreditCard;
                return (
                  <button
                    key={key}
                    disabled={!method.available}
                    onClick={() => setPaymentMethod(key)}
                    className={`w-full flex items-center gap-3 px-4 py-3 border transition-colors duration-200 text-left cursor-pointer ${
                      !method.available
                        ? "opacity-50 cursor-not-allowed"
                        : isSelected
                        ? "border-primary bg-primary-light"
                        : "border-gray-200 hover:border-primary"
                    }`}
                  >
                    {method.logo ? (
                      <img
                        src={method.logo}
                        alt={method.label}
                        className="w-8 h-8 object-contain shrink-0"
                      />
                    ) : (
                      <Icon className={`w-5 h-5 ${isSelected ? "text-primary" : "text-gray-400"}`} />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-dark">{method.label}</p>
                      <p className="text-xs text-gray-400">
                        {!method.available
                          ? "Coming soon"
                          : method.ussd
                          ? "Pay via USSD push"
                          : "Pay when order arrives"}
                      </p>
                    </div>
                    {isSelected && <Check className="w-5 h-5 text-primary" />}
                    {!method.available && <ChevronRight className="w-4 h-4 text-gray-300" />}
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        <div className="bg-white border border-gray-100 shadow-sm p-5 sticky top-40">
          <h2 className="font-bold text-dark mb-4 font-[family-name:var(--font-heading)]">
            Order Summary
          </h2>
          <div className="max-h-40 overflow-y-auto mb-3 space-y-2">
            {items.map((item) => (
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
          <div className="space-y-3 text-sm border-t border-gray-100 pt-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-semibold text-dark">{formatTZS(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Delivery Fee</span>
              <span className="font-semibold text-dark">{formatTZS(deliveryFee)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Service Fee</span>
              <span className="font-semibold text-dark">{formatTZS(serviceFee)}</span>
            </div>
            <div className="border-t border-gray-100 pt-3 flex justify-between">
              <span className="font-bold text-dark">Total</span>
              <span className="font-bold text-primary text-lg font-[family-name:var(--font-heading)]">
                {formatTZS(total)}
              </span>
            </div>
          </div>

          {error && (
            <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2">
              {error}
            </p>
          )}

          <button
            onClick={handlePlaceOrder}
            disabled={placing}
            className="mt-5 w-full flex items-center justify-center gap-2 py-3 bg-primary text-white font-semibold hover:bg-primary-dark transition-colors cursor-pointer disabled:opacity-60"
          >
            {placing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Placing order...
              </>
            ) : (
              <>Place Order · {formatTZS(total)}</>
            )}
          </button>
        </div>
      </div>

      {items.length === 0 && (
        <div className="py-20 text-center">
          <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-lg font-semibold text-dark">Your cart is empty</p>
          <Link to="/app" className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-primary text-white font-semibold">
            <Store className="w-5 h-5" /> Browse Restaurants
          </Link>
        </div>
      )}

      <UsdPaymentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={(order) => {
          clearCart();
          setPlacedOrder(order);
        }}
        method={paymentMethod}
        restaurantId={restaurantId}
        items={items}
        deliveryAddress={{
          label: address.label,
          street: address.street,
          area: address.area,
          city: address.city,
          isDefault: address.isDefault,
        }}
      />
      </div>
    </>
  );
}

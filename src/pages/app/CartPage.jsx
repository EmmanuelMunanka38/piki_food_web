import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  Store,
} from "lucide-react";
import { useCartStore } from "../../store/cartStore";
import { formatTZS } from "../../lib/format";
import FoodImage from "../../components/app/FoodImage";

export default function CartPage() {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const restaurantName = useCartStore((s) => s.restaurantName);
  const deliveryFee = useCartStore((s) => s.deliveryFee);
  const serviceFee = useCartStore((s) => s.serviceFee);
  const updateQty = useCartStore((s) => s.updateQty);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotal = useCartStore((s) => s.subtotal());
  const itemCount = useCartStore((s) => s.itemCount());

  const total = subtotal + deliveryFee + serviceFee;

  if (items.length === 0) {
    return (
      <div className="py-20 text-center">
        <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold text-dark font-[family-name:var(--font-heading)]">
          Your cart is empty
        </h1>
        <p className="text-gray-500 text-sm mt-2 mb-6">
          Add items from a restaurant to get started
        </p>
        <Link
          to="/app"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold hover:bg-primary-dark transition-colors"
        >
          <Store className="w-5 h-5" /> Browse Restaurants
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-dark font-[family-name:var(--font-heading)] mb-1">
        Review Order
      </h1>
      {restaurantName && (
        <p className="text-primary font-semibold text-sm mb-8">{restaurantName}</p>
      )}

      <div className="grid md:grid-cols-[1fr_340px] gap-6 items-start">
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-bold text-dark">Your Basket</h2>
            <span className="text-sm font-semibold text-primary">
              {itemCount} {itemCount === 1 ? "Item" : "Items"}
            </span>
          </div>

          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white border border-gray-100 shadow-sm p-4 flex gap-4"
            >
              <FoodImage
                src={item.menuItem?.image}
                alt={item.name}
                className="w-20 h-20 object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-dark line-clamp-1">{item.name}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {formatTZS(item.price)} each
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-gray-200">
                    <button
                      onClick={() => updateQty(item.id, item.quantity - 1)}
                      className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4 text-primary" />
                    </button>
                    <span className="w-10 text-center text-sm font-semibold text-dark">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQty(item.id, item.quantity + 1)}
                      className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4 text-primary" />
                    </button>
                  </div>
                  <p className="font-bold text-primary font-[family-name:var(--font-heading)]">
                    {formatTZS(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-white border border-gray-100 shadow-sm p-5 sticky top-40">
          <h2 className="font-bold text-dark mb-4 font-[family-name:var(--font-heading)]">
            Order Summary
          </h2>
          <div className="space-y-3 text-sm">
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
              <span className="font-bold text-primary font-[family-name:var(--font-heading)] text-lg">
                {formatTZS(total)}
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate("/app/checkout")}
            className="mt-5 w-full flex items-center justify-center gap-2 py-3 bg-primary text-white font-semibold hover:bg-primary-dark transition-colors cursor-pointer"
          >
            Proceed to Checkout <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

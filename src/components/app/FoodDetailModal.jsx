import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingCart, Check } from "lucide-react";
import { useCartStore } from "../../store/cartStore";
import { formatTZS } from "../../lib/format";
import FoodImage from "./FoodImage";

export default function FoodDetailModal({ item, open, onClose }) {
  const addItem = useCartStore((s) => s.addItem);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (!open) {
      setQty(1);
      setAdded(false);
    }
  }

  const handleAdd = () => {
    addItem(item, qty);
    setAdded(true);
    setTimeout(onClose, 900);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 28 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 28 }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
              className="w-full max-w-lg bg-white shadow-2xl relative"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-dark">
                <FoodImage
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                {item.isPopular && (
                  <span className="absolute top-3 left-3 px-3 py-1 text-[11px] font-semibold bg-amber-400 text-white uppercase tracking-wide">
                    Popular
                  </span>
                )}
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-dark" />
                </button>
                {!item.isAvailable && (
                  <span className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="px-4 py-1.5 text-sm font-semibold bg-white text-red-500">
                      Currently Unavailable
                    </span>
                  </span>
                )}
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-dark font-[family-name:var(--font-heading)]">
                      {item.name}
                    </h3>
                    {item.restaurant?.name && (
                      <p className="text-sm text-gray-400 mt-0.5">{item.restaurant.name}</p>
                    )}
                  </div>
                  <span className="text-xl md:text-2xl font-bold text-primary font-[family-name:var(--font-heading)] shrink-0">
                    {formatTZS(item.price)}
                  </span>
                </div>

                <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                  {item.description || "A delicious dish prepared fresh for you."}
                </p>

                <div className="mt-6 flex items-center gap-4">
                  <div className="flex items-center border border-gray-200 shrink-0">
                    <button
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="w-11 h-11 flex items-center justify-center hover:bg-gray-50 cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4 text-primary" />
                    </button>
                    <span className="w-12 text-center text-base font-bold text-dark">{qty}</span>
                    <button
                      onClick={() => setQty(qty + 1)}
                      className="w-11 h-11 flex items-center justify-center hover:bg-gray-50 cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4 text-primary" />
                    </button>
                  </div>

                  <button
                    onClick={handleAdd}
                    disabled={!item.isAvailable || added}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-white font-semibold hover:bg-primary-dark transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {added ? (
                      <>
                        <Check className="w-5 h-5" /> Added to Cart
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        Add to Cart · {formatTZS(item.price * qty)}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

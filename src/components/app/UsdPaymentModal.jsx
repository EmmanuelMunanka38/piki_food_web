import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Smartphone,
  Loader2,
  CheckCircle2,
  XCircle,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";
import { ordersService } from "../../services/orders";
import { paymentService } from "../../services/payment";
import { formatTZS } from "../../lib/format";
import { normalizePhone } from "../../lib/payments";

const POLL_INTERVAL = 3000;
const POLL_TIMEOUT = 120000;

export default function UsdPaymentModal({
  open,
  onClose,
  onSuccess,
  method,
  restaurantId,
  items,
  deliveryAddress,
  specialInstructions,
}) {
  const user = useAuthStore((s) => s.user);
  const deliveryFee = useCartStore((s) => s.deliveryFee);
  const serviceFee = useCartStore((s) => s.serviceFee);

  const [phone, setPhone] = useState(user?.phone || "");
  const [state, setState] = useState("enter"); // enter | paying | polling | success | failed | expired
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState(null);
  const pollRef = useRef(null);
  const timeoutRef = useRef(null);
  const stateRef = useRef("enter");
  const orderRef = useRef(null);

  const clearTimers = () => {
    if (pollRef.current) clearInterval(pollRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    pollRef.current = null;
    timeoutRef.current = null;
  };

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    if (!open) clearTimers();
  }, [open]);

  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (!open) {
      setState("enter");
      setError("");
      setOrderId(null);
    }
  }

  const subtotal = items.reduce((s, i) => s + i.quantity * i.price, 0);
  const total = subtotal + deliveryFee + serviceFee;

  const startPolling = (orderReference) => {
    clearTimers();
    timeoutRef.current = setTimeout(() => {
      if (stateRef.current === "polling") {
        setState("expired");
      }
    }, POLL_TIMEOUT);

    pollRef.current = setInterval(async () => {
      try {
        const txn = await paymentService.getTransactionStatus(orderReference);
        if (txn.status === "SUCCESSFUL") {
          clearTimers();
          setState("success");
          setTimeout(() => {
            onSuccess?.(orderRef.current);
          }, 1200);
        } else if (txn.status === "FAILED") {
          clearTimers();
          setState("failed");
          ordersService.cancelOrder(orderId).catch(() => {});
        }
      } catch {
        // keep polling
      }
    }, POLL_INTERVAL);
  };

  const handleConfirm = async (e) => {
    if (e) e.preventDefault();
    const normalized = normalizePhone(phone);
    if (normalized.length < 10) {
      setError("Please enter a valid mobile money number.");
      return;
    }
    setError("");
    setState("paying");
    try {
      const order = await ordersService.placeOrder({
        restaurantId,
        items,
        paymentMethod: method,
        deliveryAddress,
        specialInstructions,
      });
      orderRef.current = order;
      setOrderId(order.id);
      const init = await paymentService.initiateUSSDPush({
        orderId: order.id,
        amount: total,
        phoneNumber: normalized,
      });
      const orderReference = init.transaction.orderReference;
      setState("polling");
      startPolling(orderReference);
    } catch (err) {
      setState("enter");
      setError(err?.message || "Payment could not be initiated. Please try again.");
    }
  };

  const handleRetry = () => {
    setState("enter");
    setError("");
  };

  const handleCancel = () => {
    if (orderId) {
      ordersService.cancelOrder(orderId).catch(() => {});
    }
    onClose();
  };

  const renderContent = () => {
    if (state === "success") {
      return (
        <div className="text-center py-8">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-dark font-[family-name:var(--font-heading)]">
            Payment Successful!
          </h3>
          <p className="text-gray-500 text-sm mt-1">Taking you to your order...</p>
        </div>
      );
    }

    if (state === "failed") {
      return (
        <div className="text-center py-8">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-dark font-[family-name:var(--font-heading)]">
            Payment Failed
          </h3>
          <p className="text-gray-500 text-sm mt-1 mb-6">
            The payment was not completed. Your order has been cancelled.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleRetry}
              className="px-5 py-2.5 bg-primary text-white font-semibold hover:bg-primary-dark cursor-pointer flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Try Again
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-gray-100 text-dark font-semibold hover:bg-gray-200 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      );
    }

    if (state === "expired") {
      return (
        <div className="text-center py-8">
          <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-dark font-[family-name:var(--font-heading)]">
            Payment Timed Out
          </h3>
          <p className="text-gray-500 text-sm mt-1 mb-6">
            We didn't receive confirmation in time. You can retry or cancel.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleRetry}
              className="px-5 py-2.5 bg-primary text-white font-semibold hover:bg-primary-dark cursor-pointer flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Retry Payment
            </button>
            <button
              onClick={handleCancel}
              className="px-5 py-2.5 bg-gray-100 text-dark font-semibold hover:bg-gray-200 cursor-pointer"
            >
              Cancel Order
            </button>
          </div>
        </div>
      );
    }

    return (
      <form onSubmit={handleConfirm}>
        <div className="mb-5 p-4 bg-gray-50 border border-gray-100">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-500">Amount to pay</span>
            <span className="font-bold text-dark">{formatTZS(total)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Method</span>
            <span className="font-semibold text-primary">{method}</span>
          </div>
        </div>

        <label className="block text-sm font-medium text-dark mb-1.5">
          Mobile Money Number
        </label>
        <div className="relative mb-4">
          <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="255 712 345 678"
            className="w-full pl-11 pr-4 py-3 border border-gray-200 focus:border-primary focus:outline-none transition-colors duration-200 text-sm"
          />
        </div>

        <p className="text-xs text-gray-400 mb-5 leading-relaxed">
          A USSD push will be sent to this number. Dial it on your phone and enter your PIN
          to authorize the payment.
        </p>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2 mb-4">
            {error}
          </p>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={state === "paying"}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-white font-semibold hover:bg-primary-dark transition-colors cursor-pointer disabled:opacity-60"
          >
            {state === "paying" ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Initiating...
              </>
            ) : (
              "Confirm & Pay"
            )}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={state === "paying"}
            className="px-5 py-3 bg-gray-100 text-dark font-semibold hover:bg-gray-200 transition-colors cursor-pointer disabled:opacity-60"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[70]"
            onClick={() => state === "paying" || state === "polling" ? undefined : onClose()}
          />
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-x-0 bottom-0 md:inset-0 md:m-auto md:max-w-md md:h-fit z-[80] bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-dark font-[family-name:var(--font-heading)]">
                {state === "paying" || state === "polling" ? "Waiting for confirmation..." : "USSD Payment"}
              </h3>
              <button
                onClick={() => (state === "paying" || state === "polling" ? undefined : onClose())}
                className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-dark" />
              </button>
            </div>

            {(state === "paying" || state === "polling") && (
              <div className="text-center py-8">
                <div className="relative w-20 h-20 mx-auto mb-5">
                  <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
                  <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin" />
                  <Smartphone className="absolute inset-0 m-auto w-8 h-8 text-primary" />
                </div>
                <p className="text-dark font-semibold">
                  {state === "paying" ? "Initiating USSD push..." : "Waiting for payment confirmation"}
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  Check your phone and enter your PIN to authorize
                </p>
              </div>
            )}

            {renderContent()}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

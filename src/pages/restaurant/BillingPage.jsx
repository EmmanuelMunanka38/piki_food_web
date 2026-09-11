import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Smartphone,
  CreditCard,
  Banknote,
  Check,
  ChevronRight,
  AlertCircle,
  Loader2,
  X,
  CheckCircle2,
  User,
  Mail,
  Phone,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { subscriptionsService } from "../../services/subscriptions";
import { formatTZS } from "../../lib/format";
import { PAYMENT_METHODS, normalizePhone } from "../../lib/payments";

const SUBSCRIPTION_METHODS = ["airtel_money", "mixx_by_yas", "halopesa", "mpesa", "card"];

const FALLBACK_PLANS = [
  {
    id: "growth",
    name: "Growth",
    priceCents: 5000000,
    maxMenuItems: 999999,
    hasAnalytics: true,
    hasOnlinePayments: true,
    priorityPlacement: true,
    featuredInPopular: true,
    customDesign: false,
    multiBranch: false,
    dedicatedManager: false,
  },
  {
    id: "pro",
    name: "Pro",
    priceCents: 9000000,
    maxMenuItems: 999999,
    hasAnalytics: true,
    hasOnlinePayments: true,
    priorityPlacement: true,
    featuredInPopular: true,
    customDesign: true,
    multiBranch: true,
    dedicatedManager: true,
  },
];

function getPlanFeatures(plan) {
  const features = [];
  features.push(
    plan.maxMenuItems === 999999
      ? "Unlimited menu items"
      : `Up to ${plan.maxMenuItems} menu items`
  );
  if (plan.hasAnalytics) features.push("Analytics dashboard");
  if (plan.hasOnlinePayments) features.push("Online payments (STK Push)");
  if (plan.priorityPlacement) features.push("Priority placement");
  if (plan.featuredInPopular) features.push("Featured in Popular Dishes");
  if (plan.customDesign) features.push("Custom restaurant page design");
  if (plan.multiBranch) features.push("Multi-branch management");
  if (plan.dedicatedManager) features.push("Dedicated account manager");
  return features;
}

export default function BillingPage() {
  const navigate = useNavigate();
  const subscription = useAuthStore((s) => s.subscription);
  const fetchSubscription = useAuthStore((s) => s.fetchSubscription);
  const isTrialActive = useAuthStore((s) => s.isTrialActive);
  const getTrialDaysLeft = useAuthStore((s) => s.getTrialDaysLeft);
  const user = useAuthStore((s) => s.user);

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState("");
  const [paymentPhone, setPaymentPhone] = useState("");
  const [paymentName, setPaymentName] = useState(user?.name || "");
  const [paymentEmail, setPaymentEmail] = useState(user?.email || "");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const { data: plans = [], isLoading: loading } = useQuery({
    queryKey: ["subscription-plans"],
    queryFn: async () => {
      const data = await subscriptionsService.listPlans();
      const paid = data.filter((p) => !p.isTrialPlan);
      return paid.length > 0 ? paid : FALLBACK_PLANS;
    },
    placeholderData: FALLBACK_PLANS,
  });

  const openPaymentModal = (plan) => {
    setSelectedPlan(plan);
    setError("");
    setSelectedProvider("");
    setPaymentPhone("");
    setPaymentName(user?.name || "");
    setPaymentEmail(user?.email || "");
  };

  const closePaymentModal = () => {
    if (!processing) setSelectedPlan(null);
  };

  const handlePay = async () => {
    setError("");
    if (!selectedProvider) {
      setError("Please choose a payment method");
      return;
    }
    if (!paymentPhone.trim()) {
      setError("Please enter your phone number");
      return;
    }
    if (!paymentName.trim()) {
      setError("Please enter your full name");
      return;
    }
    if (!paymentEmail.trim()) {
      setError("Please enter your email address");
      return;
    }

    setProcessing(true);
    try {
      const phone = normalizePhone(paymentPhone);
      if (subscription?.isTrial) {
        await subscriptionsService.upgrade(selectedPlan.id, phone);
      } else {
        await subscriptionsService.subscribe(selectedPlan.id, phone);
      }
      await fetchSubscription();
      navigate("/restaurant");
    } catch (err) {
      setError(err?.message || "Failed to process payment");
    } finally {
      setProcessing(false);
    }
  };

  const trialDaysLeft = getTrialDaysLeft();
  const isTrial = subscription?.isTrial;
  const isActive = isTrialActive();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark font-[family-name:var(--font-heading)]">
          Billing &amp; Subscription
        </h1>
        <p className="text-gray-500 mt-1">Choose a plan that fits your restaurant</p>
      </div>

      {isTrial && (
        <div
          className={`p-4 border ${
            isActive ? "bg-primary-light border-primary" : "bg-red-50 border-red-200"
          }`}
        >
          <div className="flex items-start gap-3">
            {isActive ? (
              <Check className="w-5 h-5 text-primary mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            )}
            <div>
              <p className={`font-semibold ${isActive ? "text-dark" : "text-red-900"}`}>
                {isActive ? "Free Trial Active" : "Trial Expired"}
              </p>
              <p className={`text-sm mt-1 ${isActive ? "text-gray-600" : "text-red-700"}`}>
                {isActive
                  ? `${trialDaysLeft} days remaining in your free trial`
                  : "Your free trial has ended. Please upgrade to continue."}
              </p>
            </div>
          </div>
        </div>
      )}

      {subscription && !isTrial && (
        <div className="p-4 border border-green-200 bg-green-50">
          <div className="flex items-start gap-3">
            <Check className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-semibold text-green-900">Active Subscription</p>
              <p className="text-sm text-green-700 mt-1">
                {subscription.plan.name} plan — {formatTZS(subscription.plan.priceCents / 100)}/month
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {plans.map((plan) => {
          const current = subscription?.planId === plan.id;
          const features = getPlanFeatures(plan);

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="relative"
            >
              <div
                className={`relative h-full flex flex-col p-8 border transition-all duration-300 ${
                  current
                    ? "border-primary bg-primary-light shadow-lg shadow-primary/10"
                    : "border-gray-100 bg-white shadow-sm hover:shadow-xl"
                }`}
              >
                {current && (
                  <span className="absolute top-4 right-4 px-2.5 py-1 bg-primary text-white text-xs font-bold uppercase tracking-wider">
                    Current
                  </span>
                )}

                <h3 className="text-xl font-bold text-dark font-[family-name:var(--font-heading)]">
                  {plan.name}
                </h3>

                <div className="flex items-end gap-1.5 mt-4 mb-6">
                  <span className="text-sm font-semibold pb-1 text-gray-400">
                    TSh
                  </span>
                  <span className="text-4xl font-extrabold tracking-tight text-dark font-[family-name:var(--font-heading)]">
                    {(plan.priceCents / 100).toLocaleString("en-US")}
                  </span>
                  <span className="text-sm mb-1 text-gray-400">
                    / month
                  </span>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-dark/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => !current && openPaymentModal(plan)}
                  disabled={current}
                  className={`w-full py-3 px-4 font-semibold text-sm transition-all duration-300 cursor-pointer ${
                    current
                      ? "bg-primary/20 text-primary cursor-default"
                      : "bg-dark text-white hover:bg-dark-lighter"
                  }`}
                >
                  {current ? (
                    <span className="flex items-center justify-center gap-2">
                      <Check className="w-4 h-4" />
                      Current Plan
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Subscribe
                    </span>
                  )}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedPlan && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-[80]"
              onClick={closePaymentModal}
            />
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="fixed inset-x-4 top-[5%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-lg bg-white z-[90] shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-dark font-[family-name:var(--font-heading)]">
                      Complete Payment
                    </h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Subscribe to {selectedPlan.name}
                    </p>
                  </div>
                  <button
                    onClick={closePaymentModal}
                    disabled={processing}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <div className="p-4 bg-gray-50 border border-gray-100 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Selected plan</p>
                      <p className="text-lg font-bold text-dark">{selectedPlan.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-extrabold text-primary font-[family-name:var(--font-heading)]">
                        {formatTZS(selectedPlan.priceCents / 100)}
                      </p>
                      <p className="text-xs text-gray-400">per month</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Method
                    </label>
                    <div className="space-y-2">
                      {SUBSCRIPTION_METHODS.map((key) => {
                        const method = PAYMENT_METHODS[key];
                        const isSelected = selectedProvider === key;
                        const Icon = method.ussd
                          ? Smartphone
                          : key === "card"
                          ? CreditCard
                          : Banknote;
                        return (
                          <button
                            key={key}
                            disabled={!method.available}
                            onClick={() => setSelectedProvider(key)}
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
                              <Icon
                                className={`w-5 h-5 ${
                                  isSelected ? "text-primary" : "text-gray-400"
                                }`}
                              />
                            )}
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-dark">{method.label}</p>
                              <p className="text-xs text-gray-400">
                                {!method.available
                                  ? "Coming soon"
                                  : method.ussd
                                  ? "Pay via USSD push"
                                  : "Pay with card"}
                              </p>
                            </div>
                            {isSelected && <Check className="w-5 h-5 text-primary" />}
                            {!method.available && (
                              <ChevronRight className="w-4 h-4 text-gray-300" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={paymentName}
                        onChange={(e) => setPaymentName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        value={paymentEmail}
                        onChange={(e) => setPaymentEmail(e.target.value)}
                        placeholder="john@restaurant.com"
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        value={paymentPhone}
                        onChange={(e) => setPaymentPhone(e.target.value)}
                        placeholder="+255 712 345 678"
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
                      />
                    </div>
                    {selectedProvider && PAYMENT_METHODS[selectedProvider]?.ussd && (
                      <p className="text-xs text-gray-500 mt-1.5">
                        You'll receive a {PAYMENT_METHODS[selectedProvider].label} USSD prompt on this number
                      </p>
                    )}
                  </div>
                </div>

                {error && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 text-sm text-red-700 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    {error}
                  </div>
                )}

                <button
                  onClick={handlePay}
                  disabled={processing}
                  className="w-full mt-6 py-3.5 px-4 bg-primary text-white font-semibold hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-primary/25 cursor-pointer"
                >
                  {processing ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending USSD prompt...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Smartphone className="w-5 h-5" />
                      Pay {formatTZS(selectedPlan.priceCents / 100)}
                    </span>
                  )}
                </button>

                <p className="text-xs text-gray-400 text-center mt-3">
                  A USSD push will be sent to your phone to confirm payment
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

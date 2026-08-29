import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Smartphone,
  CreditCard,
  Banknote,
  Check,
  ChevronRight,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { subscriptionsService } from "../../services/subscriptions";
import { formatTZS } from "../../lib/format";
import { PAYMENT_METHODS, normalizePhone } from "../../lib/payments";

const SUBSCRIPTION_METHODS = ["airtel_money", "mixx_by_yas", "halopesa", "mpesa", "card"];

export default function BillingPage() {
  const navigate = useNavigate();
  const subscription = useAuthStore((s) => s.subscription);
  const fetchSubscription = useAuthStore((s) => s.fetchSubscription);
  const isTrialActive = useAuthStore((s) => s.isTrialActive);
  const getTrialDaysLeft = useAuthStore((s) => s.getTrialDaysLeft);

  const [upgradingPlanId, setUpgradingPlanId] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState("");
  const [paymentPhone, setPaymentPhone] = useState("");
  const [error, setError] = useState("");

  const { data: plans = [], isLoading: loading } = useQuery({
    queryKey: ["subscription-plans"],
    queryFn: async () => {
      const data = await subscriptionsService.listPlans();
      return data.filter((p) => !p.isTrialPlan);
    },
  });

  const handleUpgrade = async (planId) => {
    setError("");
    if (!selectedProvider) {
      setError("Please choose a payment method");
      return;
    }
    if (!paymentPhone.trim()) {
      setError("Please enter your payment phone number");
      return;
    }

    setUpgradingPlanId(planId);
    try {
      const phone = normalizePhone(paymentPhone);
      if (subscription?.isTrial) {
        await subscriptionsService.upgrade(planId, phone);
      } else {
        await subscriptionsService.subscribe(planId, phone);
      }
      await fetchSubscription();
      navigate("/restaurant");
    } catch (err) {
      setError(err?.message || "Failed to process payment");
    } finally {
      setUpgradingPlanId(null);
    }
  };

  const trialDaysLeft = getTrialDaysLeft();
  const isTrial = subscription?.isTrial;
  const isActive = isTrialActive();

  const selectedMethod = selectedProvider ? PAYMENT_METHODS[selectedProvider] : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark font-[family-name:var(--font-heading)]">
          Billing &amp; Subscription
        </h1>
        <p className="text-gray-500 mt-1">Manage your subscription plan</p>
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
              <p
                className={`font-semibold ${
                  isActive ? "text-dark" : "text-red-900"
                }`}
              >
                {isActive ? "Free Trial Active" : "Trial Expired"}
              </p>
              <p
                className={`text-sm mt-1 ${
                  isActive ? "text-gray-600" : "text-red-700"
                }`}
              >
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
                {subscription.plan.name} plan - {formatTZS(subscription.plan.priceCents / 100)}/month
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-dark mb-4 font-[family-name:var(--font-heading)]">
          Choose a Plan
        </h2>

        <div className="space-y-4">
          <div>
            <p className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method
            </p>
            <div className="space-y-2.5">
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

          {selectedProvider && selectedMethod?.ussd && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {selectedMethod.label} Number
              </label>
              <input
                type="tel"
                value={paymentPhone}
                onChange={(e) => setPaymentPhone(e.target.value)}
                placeholder="+255 712 345 678"
                className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                You'll receive a {selectedMethod.label} prompt to complete payment
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 mt-6">
          {plans.map((plan) => {
            const current = subscription?.planId === plan.id;
            return (
              <div
                key={plan.id}
                className={`border p-4 transition-shadow duration-200 hover:shadow-md ${
                  current
                    ? "border-primary bg-primary-light"
                    : "border-gray-200"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-dark">{plan.name}</h3>
                    <p className="text-2xl font-bold text-primary mt-1">
                      {formatTZS(plan.priceCents / 100)}
                      <span className="text-sm font-normal text-gray-500">/month</span>
                    </p>
                  </div>
                  {current && (
                    <span className="px-2 py-1 bg-primary text-white text-xs">
                      Current
                    </span>
                  )}
                </div>

                <ul className="space-y-2 mb-4">
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-primary mt-0.5" />
                    <span>
                      {plan.maxMenuItems === 999999 ? "Unlimited" : plan.maxMenuItems} menu items
                    </span>
                  </li>
                  {plan.hasAnalytics && (
                    <li className="flex items-start gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-primary mt-0.5" />
                      <span>Analytics dashboard</span>
                    </li>
                  )}
                  {plan.hasOnlinePayments && (
                    <li className="flex items-start gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-primary mt-0.5" />
                      <span>Online payments (STK Push)</span>
                    </li>
                  )}
                  {plan.priorityPlacement && (
                    <li className="flex items-start gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-primary mt-0.5" />
                      <span>Priority placement</span>
                    </li>
                  )}
                  {plan.featuredInPopular && (
                    <li className="flex items-start gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-primary mt-0.5" />
                      <span>Featured in Popular Dishes</span>
                    </li>
                  )}
                  {plan.customDesign && (
                    <li className="flex items-start gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-primary mt-0.5" />
                      <span>Custom restaurant page design</span>
                    </li>
                  )}
                  {plan.multiBranch && (
                    <li className="flex items-start gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-primary mt-0.5" />
                      <span>Multi-branch management</span>
                    </li>
                  )}
                  {plan.dedicatedManager && (
                    <li className="flex items-start gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-primary mt-0.5" />
                      <span>Dedicated account manager</span>
                    </li>
                  )}
                </ul>

                <button
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={
                    upgradingPlanId === plan.id ||
                    current ||
                    !selectedProvider ||
                    !paymentPhone.trim()
                  }
                  className="w-full py-2 px-4 bg-primary text-white hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {upgradingPlanId === plan.id ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </span>
                  ) : current ? (
                    "Current Plan"
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      {isTrial ? "Upgrade Now" : "Subscribe"}
                    </span>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

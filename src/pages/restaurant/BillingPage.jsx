import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { CreditCard, Check, AlertCircle, Loader2 } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { subscriptionsService } from "../../services/subscriptions";
import { formatTZS } from "../../lib/format";

export default function BillingPage() {
  const navigate = useNavigate();
  const subscription = useAuthStore((s) => s.subscription);
  const fetchSubscription = useAuthStore((s) => s.fetchSubscription);
  const isTrialActive = useAuthStore((s) => s.isTrialActive);
  const getTrialDaysLeft = useAuthStore((s) => s.getTrialDaysLeft);
  
  const [upgrading, setUpgrading] = useState(false);
  const [paymentPhone, setPaymentPhone] = useState("");
  const [error, setError] = useState("");

  const { data: plans = [], isLoading: loading } = useQuery({
    queryKey: ["subscription-plans"],
    queryFn: async () => {
      const data = await subscriptionsService.listPlans();
      return data.filter(p => !p.isTrialPlan);
    },
  });

  const handleUpgrade = async (planId) => {
    setError("");
    if (!paymentPhone.trim()) {
      setError("Please enter your payment phone number");
      return;
    }

    setUpgrading(true);
    try {
      if (subscription?.isTrial) {
        await subscriptionsService.upgrade(planId, paymentPhone);
      } else {
        await subscriptionsService.subscribe(planId, paymentPhone);
      }
      await fetchSubscription();
      navigate("/restaurant");
    } catch (err) {
      setError(err?.message || "Failed to process payment");
    } finally {
      setUpgrading(false);
    }
  };

  const trialDaysLeft = getTrialDaysLeft();
  const isTrial = subscription?.isTrial;
  const isActive = isTrialActive();

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
        <h1 className="text-2xl font-bold text-dark">Billing & Subscription</h1>
        <p className="text-gray-500 mt-1">Manage your subscription plan</p>
      </div>

      {isTrial && (
        <div className={`p-4 border rounded-lg ${isActive ? "bg-blue-50 border-blue-200" : "bg-red-50 border-red-200"}`}>
          <div className="flex items-start gap-3">
            {isActive ? (
              <Check className="w-5 h-5 text-blue-600 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            )}
            <div>
              <p className={`font-semibold ${isActive ? "text-blue-900" : "text-red-900"}`}>
                {isActive ? "Free Trial Active" : "Trial Expired"}
              </p>
              <p className={`text-sm mt-1 ${isActive ? "text-blue-700" : "text-red-700"}`}>
                {isActive 
                  ? `${trialDaysLeft} days remaining in your free trial`
                  : "Your free trial has ended. Please upgrade to continue."}
              </p>
            </div>
          </div>
        </div>
      )}

      {subscription && !isTrial && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
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

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-dark mb-4">Upgrade Your Plan</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Phone Number
          </label>
          <input
            type="tel"
            value={paymentPhone}
            onChange={(e) => setPaymentPhone(e.target.value)}
            placeholder="+255 712 345 678"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            You'll receive an M-Pesa prompt to complete payment
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`border rounded-lg p-4 ${
                subscription?.planId === plan.id
                  ? "border-primary bg-primary-50"
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
                {subscription?.planId === plan.id && (
                  <span className="px-2 py-1 bg-primary text-white text-xs rounded">
                    Current
                  </span>
                )}
              </div>

              <ul className="space-y-2 mb-4">
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500 mt-0.5" />
                  <span>
                    {plan.maxMenuItems === 999999 ? "Unlimited" : plan.maxMenuItems} menu items
                  </span>
                </li>
                {plan.hasAnalytics && (
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500 mt-0.5" />
                    <span>Analytics dashboard</span>
                  </li>
                )}
                {plan.hasOnlinePayments && (
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500 mt-0.5" />
                    <span>Online payments (STK Push)</span>
                  </li>
                )}
                {plan.priorityPlacement && (
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500 mt-0.5" />
                    <span>Priority placement</span>
                  </li>
                )}
                {plan.featuredInPopular && (
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500 mt-0.5" />
                    <span>Featured in Popular Dishes</span>
                  </li>
                )}
                {plan.customDesign && (
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500 mt-0.5" />
                    <span>Custom restaurant page design</span>
                  </li>
                )}
                {plan.multiBranch && (
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500 mt-0.5" />
                    <span>Multi-branch management</span>
                  </li>
                )}
                {plan.dedicatedManager && (
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500 mt-0.5" />
                    <span>Dedicated account manager</span>
                  </li>
                )}
              </ul>

              <button
                onClick={() => handleUpgrade(plan.id)}
                disabled={upgrading || subscription?.planId === plan.id || !paymentPhone.trim()}
                className="w-full py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {upgrading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </span>
                ) : subscription?.planId === plan.id ? (
                  "Current Plan"
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    {isTrial ? "Upgrade Now" : "Subscribe"}
                  </span>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

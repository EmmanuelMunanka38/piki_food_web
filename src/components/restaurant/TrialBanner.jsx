import { AlertCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

export default function TrialBanner() {
  const subscription = useAuthStore((s) => s.subscription);
  const isTrialActive = useAuthStore((s) => s.isTrialActive);
  const getTrialDaysLeft = useAuthStore((s) => s.getTrialDaysLeft);

  if (!subscription) {
    return (
      <div className="bg-primary border-b border-primary-dark px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-white" />
            <p className="text-sm font-semibold text-white font-[family-name:var(--font-heading)]">
              Activate your subscription plan to start using the platform
            </p>
          </div>
          <Link
            to="/restaurant/billing"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white text-primary text-sm font-semibold hover:bg-gray-100 transition-colors duration-200"
          >
            Choose Plan
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  if (!subscription.isTrial) {
    return null;
  }

  const daysLeft = getTrialDaysLeft();
  const isActive = isTrialActive();

  if (!isActive) {
    return (
      <div className="bg-red-600 border-b border-red-700 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-white" />
            <p className="text-sm font-semibold text-white font-[family-name:var(--font-heading)]">
              Your free trial has expired. Upgrade to continue using the platform.
            </p>
          </div>
          <Link
            to="/restaurant/billing"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white text-red-600 text-sm font-semibold hover:bg-gray-100 transition-colors duration-200"
          >
            Upgrade Now
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  if (daysLeft <= 7) {
    return (
      <div className="bg-amber-500 border-b border-amber-600 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-white" />
            <p className="text-sm font-semibold text-white font-[family-name:var(--font-heading)]">
              Your free trial expires in {daysLeft} {daysLeft === 1 ? "day" : "days"}. Upgrade now to keep your restaurant active.
            </p>
          </div>
          <Link
            to="/restaurant/billing"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white text-amber-600 text-sm font-semibold hover:bg-gray-100 transition-colors duration-200"
          >
            Upgrade
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border-b border-blue-100 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600" />
          <p className="text-sm font-semibold text-blue-900 font-[family-name:var(--font-heading)]">
            You have {daysLeft} {daysLeft === 1 ? "day" : "days"} left in your free trial.
          </p>
        </div>
        <Link
          to="/restaurant/billing"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors duration-200"
        >
          Choose Plan
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

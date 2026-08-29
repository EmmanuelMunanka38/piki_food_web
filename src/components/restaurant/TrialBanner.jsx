import { AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

export default function TrialBanner() {
  const subscription = useAuthStore((s) => s.subscription);
  const isTrialActive = useAuthStore((s) => s.isTrialActive);
  const getTrialDaysLeft = useAuthStore((s) => s.getTrialDaysLeft);

  if (!subscription?.isTrial) return null;

  const daysLeft = getTrialDaysLeft();
  const isActive = isTrialActive();

  if (!isActive) {
    return (
      <div className="bg-red-50 border-b border-red-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-sm font-medium text-red-900">
              Your free trial has expired. Please upgrade to continue using the platform.
            </p>
          </div>
          <Link
            to="/restaurant/billing"
            className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors"
          >
            Upgrade Now
          </Link>
        </div>
      </div>
    );
  }

  if (daysLeft <= 7) {
    return (
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <p className="text-sm font-medium text-amber-900">
              Your free trial expires in {daysLeft} {daysLeft === 1 ? "day" : "days"}. Upgrade now to keep your restaurant active.
            </p>
          </div>
          <Link
            to="/restaurant/billing"
            className="px-4 py-2 bg-amber-600 text-white text-sm font-semibold rounded-lg hover:bg-amber-700 transition-colors"
          >
            Upgrade
          </Link>
        </div>
      </div>
    );
  }

  return null;
}

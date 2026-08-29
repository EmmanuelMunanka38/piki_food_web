import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getAccessToken } from "../../lib/tokens";
import { useAuthStore } from "../../store/authStore";

export default function RequireRestaurantAuth({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const subscription = useAuthStore((s) => s.subscription);
  const fetchSubscription = useAuthStore((s) => s.fetchSubscription);
  const isTrialActive = useAuthStore((s) => s.isTrialActive);
  const isSubscriptionActive = useAuthStore((s) => s.isSubscriptionActive);
  const hasToken = Boolean(getAccessToken());
  const isOwner = user ? user.role === "restaurant_owner" : true;
  const [ready, setReady] = useState(hasToken);
  const [checkingSubscription, setCheckingSubscription] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (!hasToken) {
        navigate("/restaurant-portal", { replace: true });
        return;
      }

      if (user && user.role && user.role !== "restaurant_owner") {
        navigate("/app", { replace: true });
        return;
      }

      if (user && user.role === "restaurant_owner" && !subscription) {
        setCheckingSubscription(true);
        await fetchSubscription();
        setCheckingSubscription(false);
      }

      setReady(true);
    };

    checkAuth();
  }, [hasToken, user, subscription, navigate, fetchSubscription]);

  useEffect(() => {
    if (!ready || !subscription) return;

    const isOnBillingPage = location.pathname === "/restaurant/billing";
    const hasActiveSubscription = isTrialActive() || isSubscriptionActive();

    if (!hasActiveSubscription && !isOnBillingPage) {
      navigate("/restaurant/billing", { replace: true });
    }
  }, [ready, subscription, location.pathname, isTrialActive, isSubscriptionActive, navigate]);

  if (!ready || !isOwner || checkingSubscription) return null;
  return children;
}

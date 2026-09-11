import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getAccessToken } from "../../lib/tokens";
import { useAuthStore } from "../../store/authStore";
import PortalSkeleton from "./PortalSkeleton";

export default function RequireRestaurantAuth({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const subscription = useAuthStore((s) => s.subscription);
  const fetchSubscription = useAuthStore((s) => s.fetchSubscription);
  const isTrialActive = useAuthStore((s) => s.isTrialActive);
  const hasToken = Boolean(getAccessToken());
  const isOwner = user ? user.role === "restaurant_owner" : true;
  const hasCachedData = hasToken && user && subscription;
  const [ready, setReady] = useState(hasCachedData);
  const [checkingSubscription, setCheckingSubscription] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(!hasCachedData);

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
      setShowSkeleton(false);
    };

    checkAuth();
  }, [hasToken, user, subscription, navigate, fetchSubscription]);

  useEffect(() => {
    if (!ready) return;

    const isOnBillingPage = location.pathname === "/restaurant/billing";

    if (subscription?.isTrial && !isTrialActive() && !isOnBillingPage) {
      navigate("/restaurant/billing", { replace: true });
    }
  }, [ready, subscription, location.pathname, isTrialActive, navigate]);

  if (showSkeleton && (!ready || !isOwner || checkingSubscription)) return <PortalSkeleton />;
  if (!ready || !isOwner) return null;
  return children;
}

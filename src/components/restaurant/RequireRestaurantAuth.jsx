import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAccessToken } from "../../lib/tokens";
import { useAuthStore } from "../../store/authStore";

export default function RequireRestaurantAuth({ children }) {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const hasToken = Boolean(getAccessToken());
  const isOwner = user ? user.role === "restaurant_owner" : true;
  const [ready] = useState(hasToken);

  useEffect(() => {
    if (!hasToken) {
      navigate("/restaurant-portal", { replace: true });
    } else if (user && user.role && user.role !== "restaurant_owner") {
      navigate("/app", { replace: true });
    }
  }, [hasToken, user, navigate]);

  if (!ready || !isOwner) return null;
  return children;
}

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/auth/AuthLayout";
import RestaurantAuthFlow from "../components/auth/RestaurantAuthFlow";
import { getAccessToken } from "../lib/tokens";
import { useAuthStore } from "../store/authStore";

export default function RestaurantPortalPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (getAccessToken()) {
      if (user?.role === "restaurant_owner") {
        navigate("/restaurant", { replace: true });
      } else if (user?.role) {
        navigate("/app", { replace: true });
      }
    }
  }, [user, navigate]);

  return (
    <AuthLayout
      image="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80"
      title="Restaurant Owner Portal"
      subtitle="Log in or register as a restaurant owner to manage your menu, track orders in real time, and grow your business on Piki Food."
    >
      <RestaurantAuthFlow />
    </AuthLayout>
  );
}

import { lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import AppLayout from "./components/app/AppLayout";
import RequireAuth from "./components/app/RequireAuth";
import RequireRestaurantAuth from "./components/restaurant/RequireRestaurantAuth";
import RestaurantLayout from "./components/restaurant/RestaurantLayout";
import PortalSkeleton from "./components/restaurant/PortalSkeleton";

const HomePage = lazy(() => import("./pages/HomePage"));
const PricingPage = lazy(() => import("./pages/PricingPage"));
const MenuPage = lazy(() => import("./pages/MenuPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const DownloadPage = lazy(() => import("./pages/DownloadPage"));
const MsosiApiPage = lazy(() => import("./pages/MsosiApiPage"));
const SignUpPage = lazy(() => import("./pages/SignUpPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage"));
const CookiePolicyPage = lazy(() => import("./pages/CookiePolicyPage"));
const RestaurantPortalPage = lazy(() => import("./pages/RestaurantPortalPage"));
const BrowsePage = lazy(() => import("./pages/app/BrowsePage"));
const RestaurantPage = lazy(() => import("./pages/app/RestaurantPage"));
const CartPage = lazy(() => import("./pages/app/CartPage"));
const CheckoutPage = lazy(() => import("./pages/app/CheckoutPage"));
const TrackPage = lazy(() => import("./pages/app/TrackPage"));
const OrdersPage = lazy(() => import("./pages/app/OrdersPage"));
const ProfilePage = lazy(() => import("./pages/app/ProfilePage"));
const OwnerDashboardPage = lazy(() => import("./pages/restaurant/DashboardPage"));
const OwnerMenuPage = lazy(() => import("./pages/restaurant/MenuPage"));
const OwnerOrdersPage = lazy(() => import("./pages/restaurant/OrdersPage"));
const OwnerSetupPage = lazy(() => import("./pages/restaurant/SetupPage"));
const OwnerBillingPage = lazy(() => import("./pages/restaurant/BillingPage"));

function App() {
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/signup" ||
    location.pathname === "/login" ||
    location.pathname === "/restaurant-portal";
  const isAppPage = location.pathname.startsWith("/app");
  const isRestaurantPage = location.pathname.startsWith("/restaurant");

  return (
    <div className="min-h-screen overflow-x-hidden">
      {!isAuthPage && !isAppPage && !isRestaurantPage && <Navbar />}
      <main>
        <Suspense fallback={isRestaurantPage ? <PortalSkeleton /> : <div className="min-h-[60vh]" />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/download" element={<DownloadPage />} />
          <Route path="/api" element={<MsosiApiPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/cookies" element={<CookiePolicyPage />} />
          <Route path="/restaurant-portal" element={<RestaurantPortalPage />} />

          <Route
            path="/restaurant"
            element={
              <RequireRestaurantAuth>
                <RestaurantLayout>
                  <OwnerDashboardPage />
                </RestaurantLayout>
              </RequireRestaurantAuth>
            }
          />
          <Route
            path="/restaurant/menu"
            element={
              <RequireRestaurantAuth>
                <RestaurantLayout>
                  <OwnerMenuPage />
                </RestaurantLayout>
              </RequireRestaurantAuth>
            }
          />
          <Route
            path="/restaurant/orders"
            element={
              <RequireRestaurantAuth>
                <RestaurantLayout>
                  <OwnerOrdersPage />
                </RestaurantLayout>
              </RequireRestaurantAuth>
            }
          />
          <Route
            path="/restaurant/setup"
            element={
              <RequireRestaurantAuth>
                <RestaurantLayout>
                  <OwnerSetupPage />
                </RestaurantLayout>
              </RequireRestaurantAuth>
            }
          />
          <Route
            path="/restaurant/billing"
            element={
              <RequireRestaurantAuth>
                <RestaurantLayout>
                  <OwnerBillingPage />
                </RestaurantLayout>
              </RequireRestaurantAuth>
            }
          />

          <Route
            path="/app"
            element={
              <RequireAuth>
                <AppLayout>
                  <BrowsePage />
                </AppLayout>
              </RequireAuth>
            }
          />
          <Route
            path="/app/restaurant/:id"
            element={
              <RequireAuth>
                <AppLayout>
                  <RestaurantPage />
                </AppLayout>
              </RequireAuth>
            }
          />
          <Route
            path="/app/cart"
            element={
              <RequireAuth>
                <AppLayout>
                  <CartPage />
                </AppLayout>
              </RequireAuth>
            }
          />
          <Route
            path="/app/checkout"
            element={
              <RequireAuth>
                <AppLayout>
                  <CheckoutPage />
                </AppLayout>
              </RequireAuth>
            }
          />
          <Route
            path="/app/track/:id"
            element={
              <RequireAuth>
                <AppLayout>
                  <TrackPage />
                </AppLayout>
              </RequireAuth>
            }
          />
          <Route
            path="/app/orders"
            element={
              <RequireAuth>
                <AppLayout>
                  <OrdersPage />
                </AppLayout>
              </RequireAuth>
            }
          />
          <Route
            path="/app/profile"
            element={
              <RequireAuth>
                <AppLayout>
                  <ProfilePage />
                </AppLayout>
              </RequireAuth>
            }
          />
        </Routes>
        </Suspense>
      </main>
      {!isAppPage && !isRestaurantPage && <Footer />}
    </div>
  );
}

export default App;

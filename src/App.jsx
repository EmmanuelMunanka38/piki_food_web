import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/HomePage";
import HowItWorksPage from "./pages/HowItWorksPage";
import MenuPage from "./pages/MenuPage";
import ContactPage from "./pages/ContactPage";
import DownloadPage from "./pages/DownloadPage";
import MsosiApiPage from "./pages/MsosiApiPage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import CookiePolicyPage from "./pages/CookiePolicyPage";
import AppLayout from "./components/app/AppLayout";
import RequireAuth from "./components/app/RequireAuth";
import BrowsePage from "./pages/app/BrowsePage";
import RestaurantPage from "./pages/app/RestaurantPage";
import CartPage from "./pages/app/CartPage";
import CheckoutPage from "./pages/app/CheckoutPage";
import TrackPage from "./pages/app/TrackPage";
import OrdersPage from "./pages/app/OrdersPage";
import ProfilePage from "./pages/app/ProfilePage";

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/signup" || location.pathname === "/login";
  const isAppPage = location.pathname.startsWith("/app");

  return (
    <div className="min-h-screen overflow-x-hidden">
      {!isAuthPage && !isAppPage && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/download" element={<DownloadPage />} />
          <Route path="/api" element={<MsosiApiPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/cookies" element={<CookiePolicyPage />} />

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
      </main>
      {!isAuthPage && !isAppPage && <Footer />}
    </div>
  );
}

export default App;

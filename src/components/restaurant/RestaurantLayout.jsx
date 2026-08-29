import { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  UtensilsCrossed,
  Receipt,
  LogOut,
  Menu as MenuIcon,
  X,
  ExternalLink,
  Settings,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";

const sideLinks = [
  { label: "Dashboard", path: "/restaurant", icon: LayoutDashboard },
  { label: "Menu", path: "/restaurant/menu", icon: UtensilsCrossed },
  { label: "Orders", path: "/restaurant/orders", icon: Receipt },
  { label: "Settings", path: "/restaurant/setup", icon: Settings },
];

export default function RestaurantLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  const initial = (user?.name || user?.email || "R").charAt(0).toUpperCase();

  const renderLinks = (onClick) =>
    sideLinks.map((link) => (
      <NavLink
        key={link.path}
        to={link.path}
        end={link.path === "/restaurant"}
        onClick={onClick}
        className={({ isActive }) =>
          `flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors duration-200 ${
            isActive
              ? "text-primary bg-primary-light border-r-4 border-primary"
              : "text-dark/70 hover:text-dark hover:bg-gray-50"
          }`
        }
      >
        <link.icon className="w-5 h-5" />
        {link.label}
      </NavLink>
    ));

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-white border-r border-gray-100 sticky top-0 h-screen">
        <div className="flex items-center gap-2 px-6 h-20 border-b border-gray-100">
          <span className="text-xl font-extrabold text-black-green tracking-tight font-[family-name:var(--font-heading)]">
            Piki<span className="text-primary">Food</span>
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary-light px-1.5 py-0.5">
            Owner
          </span>
        </div>
        <nav className="flex-1 py-4 space-y-1">{renderLinks()}</nav>
        <div className="p-4 border-t border-gray-100 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-dark/70 hover:text-dark hover:bg-gray-50 transition-colors duration-200"
          >
            <ExternalLink className="w-5 h-5" />
            View storefront
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-200 cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            Log out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-40 bg-white border-b border-gray-100 lg:hidden">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center gap-2">
              <span className="text-lg font-extrabold text-black-green tracking-tight font-[family-name:var(--font-heading)]">
                Piki<span className="text-primary">Food</span>
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary-light px-1.5 py-0.5">
                Owner
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-primary flex items-center justify-center text-white font-bold text-sm">
                {initial}
              </div>
              <button
                onClick={() => setMobileOpen(true)}
                className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 cursor-pointer"
                aria-label="Open menu"
              >
                <MenuIcon className="w-6 h-6 text-dark" />
              </button>
            </div>
          </div>
        </header>

        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 z-[60] lg:hidden"
                onClick={() => setMobileOpen(false)}
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed top-0 left-0 bottom-0 w-[280px] bg-white z-[70] flex flex-col lg:hidden"
              >
                <div className="flex items-center justify-between px-6 h-16 border-b border-gray-100">
                  <span className="text-xl font-extrabold text-black-green font-[family-name:var(--font-heading)]">
                    Piki<span className="text-primary">Food</span>
                  </span>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 cursor-pointer"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5 text-dark" />
                  </button>
                </div>
                <nav className="flex-1 py-4 space-y-1">{renderLinks(() => setMobileOpen(false))}</nav>
                <div className="p-4 border-t border-gray-100 space-y-1">
                  <Link
                    to="/"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-dark/70 hover:text-dark hover:bg-gray-50 transition-colors duration-200"
                  >
                    <ExternalLink className="w-5 h-5" />
                    View storefront
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-200 cursor-pointer"
                  >
                    <LogOut className="w-5 h-5" />
                    Log out
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <div className="hidden lg:flex items-center justify-between px-8 h-16 border-b border-gray-100 bg-white">
          <h1 className="text-lg font-bold text-dark font-[family-name:var(--font-heading)]">
            {sideLinks.find((l) => l.path === location.pathname)?.label || "Dashboard"}
          </h1>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-dark leading-tight">
                {user?.name || "Restaurant Owner"}
              </p>
              <p className="text-xs text-gray-400 leading-tight">{user?.email}</p>
            </div>
            <div className="w-9 h-9 bg-primary flex items-center justify-center text-white font-bold text-sm">
              {initial}
            </div>
          </div>
        </div>

        <main className="flex-1 w-full max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}

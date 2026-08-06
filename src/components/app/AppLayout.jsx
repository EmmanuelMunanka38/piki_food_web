import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingCart,
  User as UserIcon,
  LogOut,
  Receipt,
  Home,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { useCartStore } from "../../store/cartStore";
import { useAuthStore } from "../../store/authStore";
import Footer from "../layout/Footer";

const appLinks = [
  { label: "Browse", path: "/app", icon: Home },
  { label: "Orders", path: "/app/orders", icon: Receipt },
];

export default function AppLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const itemCount = useCartStore((s) => s.itemCount());
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [query, setQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const submitSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/app?q=${encodeURIComponent(query.trim())}`);
      setMobileOpen(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  const initial = (user?.name || user?.email || "U").charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20 gap-4">
            <Link to="/app" className="flex items-center shrink-0">
              <span className="text-xl font-extrabold text-black-green tracking-tight font-[family-name:var(--font-heading)]">
                Piki<span className="text-primary">Food</span>
              </span>
            </Link>

            <form
              onSubmit={submitSearch}
              className="hidden md:flex flex-1 max-w-xl items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-50 border border-gray-200 focus-within:border-primary transition-colors duration-200"
            >
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search restaurants or dishes..."
                className="w-full bg-transparent text-sm text-dark focus:outline-none"
              />
            </form>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden w-10 h-10 flex items-center justify-center hover:bg-gray-50 cursor-pointer"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6 text-dark" />
              </button>

              <Link
                to="/app/cart"
                className="relative w-11 h-11 flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <ShoppingCart className="w-5 h-5 text-dark" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 px-1 bg-primary text-white text-xs font-bold flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>

              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen((v) => !v)}
                  className="flex items-center gap-2 pl-2 pr-1 py-1 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="w-9 h-9 bg-primary flex items-center justify-center text-white font-bold text-sm overflow-hidden">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      initial
                    )}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${profileOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-100 shadow-lg z-50"
                    >
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-dark truncate">
                          {user?.name || "PikiFood User"}
                        </p>
                        <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                      </div>
                      <div className="py-1">
                        <Link
                          to="/app/profile"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-dark/80 hover:bg-gray-50 hover:text-dark"
                        >
                          <UserIcon className="w-4 h-4" /> Profile
                        </Link>
                        <Link
                          to="/app/orders"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-dark/80 hover:bg-gray-50 hover:text-dark"
                        >
                          <Receipt className="w-4 h-4" /> My Orders
                        </Link>
                        <Link
                          to="/"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-dark/80 hover:bg-gray-50 hover:text-dark"
                        >
                          <Home className="w-4 h-4" /> Home
                        </Link>
                      </div>
                      <div className="border-t border-gray-100 py-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" /> Log out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden md:block border-t border-gray-100">
          <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
            <nav className="flex items-center gap-1">
              {appLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === "/app"}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors duration-200 ${
                      isActive
                        ? "text-primary border-primary"
                        : "text-dark/60 hover:text-dark border-transparent"
                    }`
                  }
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </NavLink>
              ))}
            </nav>
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
              className="fixed inset-0 bg-black/40 z-[60]"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 bottom-0 w-[300px] bg-white z-[70] flex flex-col"
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
              <form onSubmit={submitSearch} className="px-4 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-100 border border-gray-200">
                  <Search className="w-4 h-4 text-gray-400" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-full bg-transparent text-sm focus:outline-none"
                  />
                </div>
              </form>
              <nav className="flex-1 px-4 py-4 space-y-1">
                {appLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 text-sm font-medium ${
                      location.pathname === link.path
                        ? "text-primary bg-primary-light"
                        : "text-dark/70"
                    }`}
                  >
                    <link.icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                ))}
                <Link
                  to="/app/profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-dark/70"
                >
                  <UserIcon className="w-5 h-5" /> Profile
                </Link>
              </nav>
              <div className="px-6 pb-6 border-t border-gray-100 pt-4">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-red-600 border border-red-200 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" /> Log out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
        {children}
      </main>

      <AnimatePresence>
        {itemCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Link
              to="/app/cart"
              className="relative flex items-center gap-2 pl-4 pr-5 py-3.5 bg-primary text-white font-semibold shadow-xl shadow-primary/30 hover:bg-primary-dark transition-colors"
              aria-label={`View cart, ${itemCount} ${itemCount === 1 ? "item" : "items"}`}
            >
              <ShoppingCart className="w-5 h-5" />
              View Cart
              <span className="min-w-[22px] h-[22px] px-1 bg-dark text-white text-xs font-bold flex items-center justify-center">
                {itemCount}
              </span>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

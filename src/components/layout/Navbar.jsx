import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, UtensilsCrossed, Home, MapPin, Phone, Download, ArrowRight, Code2 } from "lucide-react";

const navLinks = [
  { label: "Home", path: "/", icon: Home }, 
  { label: "How It Works", path: "/how-it-works", icon: MapPin },
  { label: "Contact", path: "/contact", icon: Phone },
  { label: "Download", path: "/download", icon: Download },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  const isHome = location.pathname === "/";

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || !isHome
            ? "bg-white/95 backdrop-blur-md shadow-sm"
            : "bg-transparent"
        }`}
      >
        <nav className="mx-auto max-w-[1440px] px-5 md:px-8 lg:px-12">
          <div className="flex items-center justify-between h-16 md:h-[72px]">
            <div className="flex items-center gap-6">
              <button
                onClick={() => setSidebarOpen(true)}
                className="flex items-center justify-center w-10 h-10 hover:bg-black/5 transition-colors duration-200"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6 text-dark" />
              </button>

              <Link to="/" className="flex items-center gap-1.5 group">
                <div className="w-8 h-8 bg-primary flex items-center justify-center">
                  <UtensilsCrossed className="w-4.5 h-4.5 text-white" />
                </div>
                <span className="text-[22px] font-extrabold text-dark tracking-tight font-[family-name:var(--font-heading)]">
                  Piki<span className="text-primary">Food</span>
                </span>
              </Link>
            </div>

            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    location.pathname === link.path
                      ? "text-primary font-semibold"
                      : "text-dark/70 hover:text-dark"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-3">
              <Link
                to="/login"
                className="px-5 py-2.5 text-sm font-semibold text-dark bg-white border border-dark/15 hover:bg-gray-50 transition-colors duration-200"
              >
                Log in
              </Link>

              <Link
                to="/signup"
                className="px-5 py-2.5 text-sm font-semibold text-white bg-dark hover:bg-dark/90 transition-colors duration-200"
              >
                Sign up
              </Link>
            </div>

            <div className="lg:hidden">
              <Link
                to="/signup"
                className="px-4 py-2 text-sm font-semibold text-white bg-dark"
              >
                Sign up
              </Link>
            </div>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 z-[60]"
              onClick={() => setSidebarOpen(false)}
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 bottom-0 w-[300px] bg-white z-[70] flex flex-col"
            >
              <div className="flex items-center justify-between px-6 h-16 border-b border-gray-100">
                <Link to="/" className="flex items-center gap-1.5" onClick={() => setSidebarOpen(false)}>
                  <div className="w-8 h-8 bg-primary flex items-center justify-center">
                    <UtensilsCrossed className="w-4.5 h-4.5 text-white" />
                  </div>
                  <span className="text-xl font-extrabold text-dark tracking-tight font-[family-name:var(--font-heading)]">
                    Piki<span className="text-primary">Food</span>
                  </span>
                </Link>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5 text-dark" />
                </button>
              </div>

              <nav className="flex-1 px-4 py-6">
                <div className="space-y-1">
                  {navLinks.map((link, i) => {
                    const isActive = location.pathname === link.path;
                    return (
                      <motion.div
                        key={link.path}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <Link
                          to={link.path}
                          onClick={() => setSidebarOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                            isActive
                              ? "text-primary bg-primary-light"
                              : "text-dark/70 hover:text-dark hover:bg-gray-50"
                          }`}
                        >
                          <link.icon className="w-5 h-5" />
                          {link.label}
                          {isActive && (
                            <ArrowRight className="w-4 h-4 ml-auto text-primary" />
                          )}
                        </Link>
                      </motion.div>
                    );
                  })}

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navLinks.length * 0.05 }}
                  >
                    <Link
                      to="/api"
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                        location.pathname === "/api"
                          ? "text-primary bg-primary-light"
                          : "text-dark/70 hover:text-dark hover:bg-gray-50"
                      }`}
                    >
                      <Code2 className="w-5 h-5" />
                      API
                      {location.pathname === "/api" && (
                        <ArrowRight className="w-4 h-4 ml-auto text-primary" />
                      )}
                    </Link>
                  </motion.div>
                </div>
              </nav>

              <div className="px-6 pb-6 space-y-3 border-t border-gray-100 pt-6">
                <Link
                  to="/login"
                  onClick={() => setSidebarOpen(false)}
                  className="block text-center px-5 py-3 text-sm font-semibold text-dark bg-white border border-dark/15 hover:bg-gray-50 transition-colors duration-200"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setSidebarOpen(false)}
                  className="block text-center px-5 py-3 text-sm font-semibold text-white bg-dark hover:bg-dark/90 transition-colors duration-200"
                >
                  Sign up
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

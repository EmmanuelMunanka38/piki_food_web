import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Globe, MessageCircle, Camera } from "lucide-react";

const quickLinks = [
  { label: "Home", path: "/" },
  { label: "Menu", path: "/menu" },
  { label: "How It Works", path: "/how-it-works" },
  { label: "Msosi API", path: "/api" },
  { label: "Contact Us", path: "/contact" },
  { label: "Download App", path: "/download" },
];

const legalLinks = [
  { label: "Privacy Policy", path: "/privacy" },
  { label: "Terms of Service", href: "#" },
  { label: "Cookie Policy", path: "/cookies" },
];

export default function Footer() {
  return (
    <footer className="bg-dark text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Link to="/" className="flex items-center mb-4">
              <span className="text-xl font-[family-name:var(--font-heading)] font-bold text-white tracking-tight">
                Piki<span className="text-primary">Food</span>
              </span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Delivering delicious food from the best restaurants in Tanzania.
              Fast, reliable, and always fresh.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="w-10 h-10 bg-white/10 flex items-center justify-center hover:bg-primary transition-colors duration-200"
              >
                <Globe className="w-5 h-5" />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="w-10 h-10 bg-white/10 flex items-center justify-center hover:bg-primary transition-colors duration-200"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="w-10 h-10 bg-white/10 flex items-center justify-center hover:bg-primary transition-colors duration-200"
              >
                <Camera className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 font-[family-name:var(--font-heading)]">
              Quick Links
            </h3>
            <ul className="space-y-1">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-white/60 hover:text-primary text-sm transition-colors duration-200 block py-1"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 font-[family-name:var(--font-heading)]">
              Contact Us
            </h3>
            <div className="flex items-center gap-3 text-white/60 text-sm mb-3">
              <Phone className="w-5 h-5 flex-shrink-0" />
              <span>+255 740 336 972 </span>
            </div>
            <div className="flex items-center gap-3 text-white/60 text-sm mb-3">
              <Mail className="w-5 h-5 flex-shrink-0" />
              <span>info@pikifood.co.tz</span>
            </div>
            <div className="flex items-center gap-3 text-white/60 text-sm mb-3">
              <MapPin className="w-5 h-5 flex-shrink-0" />
              <span>Mikocheni, Dar es Salaam</span>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 font-[family-name:var(--font-heading)]">
              Stay Updated
            </h3>
            <p className="text-white/60 text-sm mb-4">
              Subscribe for the latest updates and offers.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="bg-white/10 border border-white/20  px-4 py-2.5 text-white placeholder-white/40 text-sm flex-1 outline-none focus:border-primary transition-colors duration-200"
              />
              <button className="bg-primary text-white px-5 py-2.5  font-semibold text-sm hover:bg-primary-dark transition-colors duration-200">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/40 text-sm">
              © 2026 Piki Food. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              {legalLinks.map((link) =>
                link.path ? (
                  <Link
                    key={link.label}
                    to={link.path}
                    className="text-white/40 hover:text-white text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-white/40 hover:text-white text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

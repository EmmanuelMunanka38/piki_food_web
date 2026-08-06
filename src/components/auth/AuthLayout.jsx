import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { UtensilsCrossed } from "lucide-react";

export default function AuthLayout({ image, title, subtitle, children }) {
  return (
    <div className="min-h-screen flex">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex lg:w-1/2 relative bg-dark"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${image}')` }}
        />
        <div className="absolute inset-0 bg-dark/60" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link to="/" className="flex items-center gap-1.5">
            <div className="w-10 h-10 bg-primary flex items-center justify-center">
              <UtensilsCrossed className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-extrabold text-white tracking-tight font-[family-name:var(--font-heading)]">
              Piki<span className="text-primary">Food</span>
            </span>
          </Link>

          <div>
            <h1 className="text-4xl font-bold text-white mb-4 font-[family-name:var(--font-heading)]">
              {title}
            </h1>
            <p className="text-white/60 text-lg">{subtitle}</p>
          </div>

          <div className="flex items-center gap-8 text-white/50 text-sm">
            <span>Trusted by 50,000+ users</span>
            <span className="w-1 h-1 bg-white/30" />
            <span>Available in 6 cities</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white"
      >
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-1.5 mb-8">
            <Link to="/" className="flex items-center gap-1.5">
              <div className="w-8 h-8 bg-primary flex items-center justify-center">
                <UtensilsCrossed className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-extrabold text-dark tracking-tight font-[family-name:var(--font-heading)]">
                Piki<span className="text-primary">Food</span>
              </span>
            </Link>
          </div>
          {children}
        </div>
      </motion.div>
    </div>
  );
}

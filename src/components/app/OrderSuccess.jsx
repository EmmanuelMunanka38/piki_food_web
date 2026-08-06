import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const CONFETTI_COLORS = ["#16A34A", "#22C55E", "#FACC15", "#F97316", "#3B82F6", "#EF4444"];

function seeded(i, salt) {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export default function OrderSuccess({ order }) {
  const navigate = useNavigate();
  const orderNumber = order.orderNumber?.replace("PIKI-", "") || order.id.slice(0, 6);

  const confetti = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        left: seeded(i, 1) * 100,
        delay: seeded(i, 2) * 0.8,
        duration: 1.8 + seeded(i, 3) * 1.4,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        size: 8 + seeded(i, 4) * 8,
      })),
    []
  );

  useEffect(() => {
    const t = setTimeout(() => {
      navigate(`/app/track/${order.id}`, { replace: true });
    }, 3500);
    return () => clearTimeout(t);
  }, [order.id, navigate]);

  return (
    <div className="fixed inset-0 z-[90] bg-dark flex items-center justify-center p-6">
      <div className="absolute inset-0 overflow-hidden">
        {confetti.map((c) => (
          <motion.span
            key={c.id}
            initial={{ y: -60, x: 0, opacity: 1, rotate: 0 }}
            animate={{ y: "105vh", x: c.id % 2 === 0 ? 40 : -40, opacity: 0, rotate: 360 }}
            transition={{ duration: c.duration, delay: c.delay, ease: "easeIn" }}
            className="absolute top-0"
            style={{ left: `${c.left}%`, width: c.size, height: c.size, backgroundColor: c.color }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center max-w-md w-full">
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          className="w-20 h-20 bg-primary mx-auto flex items-center justify-center shadow-2xl shadow-primary/30"
        >
          <Check className="w-10 h-10 text-white" strokeWidth={3} />
        </motion.div>

        <motion.div
          initial={{ scale: 1.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 border-2 border-primary pointer-events-none"
        />

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="mt-8 text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-heading)]"
        >
          Thank you for your order!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5 }}
          className="mt-4 text-white/70 text-base md:text-lg"
        >
          Your delicious food is being prepared. We'll update you on its status in real time.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.75, duration: 0.4 }}
          className="mt-8 inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 border border-white/20 text-white font-semibold"
        >
          <Check className="w-4 h-4 text-primary" />
          Order #{orderNumber}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.5 }}
          className="mt-10 text-white/40 text-sm"
        >
          Taking you to order tracking...
        </motion.p>
      </div>
    </div>
  );
}

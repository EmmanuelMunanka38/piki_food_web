import { motion } from "framer-motion";
import { Store, Package, TrendingUp, Shield, Clock, Star } from "lucide-react";

const rows = [
  {
    title: "Grow Your Restaurant's Digital Presence",
    description:
      "Join hundreds of restaurants already reaching more customers through Piki Food. Our platform makes it easy to manage orders, track performance, and get paid — so you can focus on what matters most: great food.",
    perks: [
      { icon: TrendingUp, text: "Access thousands of active, hungry customers daily" },
      { icon: Store, text: "Simple dashboard to manage menu, hours, and orders" },
      { icon: Shield, text: "Reliable M-Pesa settlements direct to your account" },
    ],
    image: "/restu.png",
    alt: "Chef preparing food in a restaurant kitchen",
    reversed: false,
  },
  {
    title: "Fresh Food Delivered to Your Doorstep",
    description:
      "Whether you're at home, in the office, or on the go, Piki Food brings your favorite local meals straight to you. Track your order in real time and pay securely with M-Pesa — no cash, no cards, no hassle.",
    perks: [
      { icon: Clock, text: "Average delivery time under 30 minutes across all cities" },
      { icon: Package, text: "GPS tracking from restaurant kitchen to your location" },
      { icon: Star, text: "Verified restaurants with transparent ratings and reviews" },
    ],
    image: "/food1.png",
    alt: "Delicious meal on a table",
    reversed: true,
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function PlatformShowcase() {
  return (
    <section className="py-16 md:py-24 bg-off-white">
      <div className="mx-auto max-w-[1440px] px-5 md:px-8 lg:px-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="space-y-16 md:space-y-24"
        >
          {rows.map((row) => (
            <motion.div
              key={row.title}
              variants={itemVariants}
              className={`flex flex-col ${row.reversed ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-8 md:gap-12 lg:gap-16`}
            >
              <div className="flex-1 w-full">
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-dark leading-tight font-[family-name:var(--font-heading)] mb-4">
                  {row.title}
                </h3>
                <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-6">
                  {row.description}
                </p>
                <ul className="space-y-3">
                  {row.perks.map((perk) => (
                    <li key={perk.text} className="flex items-start gap-3">
                      <div className="w-7 h-7 bg-primary-light flex items-center justify-center flex-shrink-0 mt-0.5">
                        <perk.icon className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <span className="text-sm md:text-base text-gray-600">{perk.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex-1 w-full">
                <div className="relative">
                  <div className="absolute -top-3 -left-3 w-full h-full border border-primary/20" />
                  <img
                    src={row.image}
                    alt={row.alt}
                    className="w-full h-[300px] md:h-[400px] object-cover relative"
                    loading="lazy"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

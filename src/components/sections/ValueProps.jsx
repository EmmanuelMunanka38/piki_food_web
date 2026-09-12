import { motion } from "framer-motion";
import { Utensils, Users, ShieldCheck } from "lucide-react";

const cards = [
  {
    icon: Utensils,
    title: "Best Restaurants",
    description: "Order from top-rated restaurants near you. Fresh meals, real flavours, made just for you.",
    image: "/restu.png",
  },
  {
    icon: Users,
    title: "Order for Anyone",
    description: "Send food to friends, coworkers or family. Just enter their address and we handle the rest.",
    image: "https://i.pinimg.com/736x/01/a8/b2/01a8b20022d3ac8d1c0ad960e7b67466.jpg",
  },
  {
    icon: ShieldCheck,
    title: "Fast & Secure",
    description: "Lightning-fast delivery with secure mobile payments. Your food arrives hot, your money stays safe.",
    image: "/fastsecure.png",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function ValueProps() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-[1440px] mx-auto px-5 md:px-8 lg:px-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
        >
          {cards.map((card) => (
            <motion.div
              key={card.title}
              variants={cardVariants}
              className="group overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-56 md:h-64 overflow-hidden bg-gray-100">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>

              <div className="p-6 md:p-7">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 flex items-center justify-center bg-primary-light">
                    <card.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3
                    className="text-lg font-bold text-dark"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {card.title}
                  </h3>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {card.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

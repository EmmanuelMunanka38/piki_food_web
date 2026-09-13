import { motion } from "framer-motion";
import { MapPin, Store, Users, Timer, Utensils, ShieldCheck } from "lucide-react";
import SectionTitle from "../ui/SectionTitle";

const stats = [
  { value: "3", label: "Cities served", icon: MapPin },
  { value: "38", label: "Partner restaurants", icon: Store },
  { value: "300+", label: "Active customers", icon: Users },
  { value: "15min", label: "Avg. delivery time", icon: Timer },
];

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

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
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

export default function About() {
  return (
    <section id="about" className="bg-off-white py-16 md:py-24">
      <div className="mx-auto max-w-[1440px] px-5 md:px-8 lg:px-12">
        <SectionTitle
          title="Redefining food delivery in East Africa"
          description="We're on a mission to make great local food accessible to everyone — quickly, affordably, and on the payment methods you already trust."
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="flex flex-col md:flex-row items-center gap-8 md:gap-12 lg:gap-16"
        >
          <motion.div variants={itemVariants} className="flex-1 w-full">
            <h3
              className="text-2xl md:text-3xl lg:text-4xl font-bold text-dark leading-tight mb-4"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Food that feels like home, delivered with care
            </h3>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-8">
              Piki Food started with a simple idea: ordering food should be as easy
              as sending a text. Today we connect thousands of hungry customers with
              the best local restaurants across Tanzania and Kenya — with real-time
              tracking, reliable riders, and payments that just work.
            </p>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-8">
              Every order supports local kitchens and riders, keeping money in the
              communities we serve while making sure your favourite meals reach you
              hot, fast, and hassle-free.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="flex-1 w-full hidden md:block">
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white border border-gray-100 shadow-sm p-5 flex items-center gap-4"
                >
                  <stat.icon className="w-5 h-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-xl md:text-2xl font-bold text-dark leading-none">
                      {stat.value}
                    </p>
                    <p className="text-xs md:text-sm text-gray-400 mt-1">
                      {stat.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-16 md:mt-20"
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

import { motion } from "framer-motion";
import { MapPin, Store, Users, Timer, Leaf, ShieldCheck, Handshake } from "lucide-react";
import SectionTitle from "../ui/SectionTitle";

const stats = [
  { value: "8+", label: "Cities served", icon: MapPin },
  { value: "500+", label: "Partner restaurants", icon: Store },
  { value: "120K", label: "Active customers", icon: Users },
  { value: "30min", label: "Avg. delivery time", icon: Timer },
];

const values = [
  {
    icon: Leaf,
    title: "Built for local tastes",
    description:
      "From ugali to biryani, we celebrate the food East Africans actually love — sourced from the kitchens around you.",
  },
  {
    icon: ShieldCheck,
    title: "Secure M-Pesa payments",
    description:
      "Pay the way you already do. Transparent pricing, no hidden fees, and settlements you can trust.",
  },
  {
    icon: Handshake,
    title: "Partners first",
    description:
      "We grow with restaurants and riders, giving them the tools and fair economics to thrive.",
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
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-dark leading-tight font-[family-name:var(--font-heading)] mb-4">
              Food that feels like home, delivered with care
            </h3>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-8">
              Piki Food started with a simple idea: ordering food should be as easy
              as sending a text. Today we connect thousands of hungry customers with
              the best local restaurants across Tanzania and Kenya — with real-time
              tracking, reliable riders, and payments that just work.
            </p>

            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white border border-gray-100 shadow-sm p-5 flex items-center gap-4"
                >
                  <div className="w-10 h-10 bg-primary-light flex items-center justify-center flex-shrink-0">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
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

          <motion.div variants={itemVariants} className="flex-1 w-full">
            <div className="relative">
              <div className="absolute -top-3 -left-3 w-full h-full border border-primary/20" />
              <img
                src="/restu.png"
                alt="A local chef preparing fresh food in the kitchen"
                className="w-full h-[320px] md:h-[440px] object-cover relative"
                loading="lazy"
              />
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 md:mt-20"
        >
          {values.map((value) => (
            <motion.div
              key={value.title}
              variants={itemVariants}
              className="bg-white border border-gray-100 shadow-sm p-6 md:p-8"
            >
              <div className="w-11 h-11 bg-primary-light flex items-center justify-center mb-5">
                <value.icon className="w-5 h-5 text-primary" />
              </div>
              <h4 className="text-lg font-bold text-dark mb-2">{value.title}</h4>
              <p className="text-sm text-gray-500 leading-relaxed">
                {value.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

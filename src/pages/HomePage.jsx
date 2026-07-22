import { motion } from "framer-motion";
import Hero from "../components/sections/Hero";
import FoodCompanies from "../components/sections/FoodCompanies";
import SectionTitle from "../components/ui/SectionTitle";
import Button from "../components/ui/Button";
import MapSection from "../components/sections/MapSection";
import Testimonials from "../components/sections/Testimonials";
import { Utensils, Bike, ChefHat, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Utensils,
    title: "Browse 500+ Restaurants Near You",
    description:
      "Access an extensive network of verified restaurants across Dar es Salaam, Nairobi, Mwanza, and beyond. Filter by cuisine type, price range, delivery time, or customer rating to find exactly what you're craving — from local street food favorites like Chips Mayai and Mishkaki to international chains.",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop",
    link: "/menu",
  },
  {
    icon: Bike,
    title: "Real-Time Tracking, Delivered in 30 Minutes",
    description:
      "Every order is assigned to a GPS-tracked rider within minutes. Watch your food travel from the restaurant kitchen to your doorstep in real time through our live map. Our average delivery time across all active cities is under 30 minutes, with temperature-controlled packaging to ensure your meal arrives hot.",
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&h=400&fit=crop",
    link: "/how-it-works",
  },
  {
    icon: ChefHat,
    title: "Secure M-Pesa Checkout, Zero Hassle",
    description:
      "Pay effortlessly with M-Pesa — no credit cards or bank accounts required. Our direct integration with Safaricom and Vodacom APIs processes STK Push payments in under 3 seconds with bank-level encryption. Every transaction is verified in real time, and your financial data is never stored on our servers.",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop",
    link: "/how-it-works",
  },
];

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export default function HomePage() {
  return (
    <>
      <Hero />

      <FoodCompanies />

      <section className="py-16 md:py-24 bg-white">
        <div className="mx-auto max-w-[1440px] px-5 md:px-8 lg:px-12">
          <SectionTitle
            subtitle="How it works"
            title="From Craving to Delivery in Three Steps"
            description="We've streamlined the entire food ordering process so you can go from browsing to eating in under 30 minutes. Here's how Piki Food works."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                custom={i}
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className="group relative overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500"
              >
                <Link to={feature.link} className="block">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-dark/10 to-transparent" />
                    <div className="absolute top-4 left-4 w-12 h-12 bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-dark mb-2 group-hover:text-primary transition-colors duration-300 font-[family-name:var(--font-heading)]">
                      {feature.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4">
                      {feature.description}
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-3 transition-all duration-300">
                      Learn more <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-12 text-center"
          >
            <Link to="/how-it-works">
              <Button variant="secondary" size="lg">
                See How It Works
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <MapSection />

      <Testimonials />
    </>
  );
}

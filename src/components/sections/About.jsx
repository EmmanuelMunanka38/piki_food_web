import { motion } from "framer-motion";
import { MapPin, Bike, ShieldCheck } from "lucide-react";

const highlights = [
  { icon: MapPin, text: "Serving Dar es Salaam, Nairobi, Mwanza, Arusha, Dodoma & Kisumu" },
  { icon: Bike, text: "GPS-tracked riders with temperature-controlled packaging" },
  { icon: ShieldCheck, text: "Secure M-Pesa payments settled directly via certified APIs" },
];

const stats = [
  { value: "500+", label: "Restaurant partners" },
  { value: "50K+", label: "Orders delivered" },
  { value: "<30min", label: "Average delivery" },
  { value: "2", label: "Countries served" },
];

export default function About() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-[1440px] px-5 md:px-8 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute -top-3 -left-3 w-full h-full border border-primary/20" />
            <img
              src="/food2.png"
              alt="Ugali na Nyama, a traditional Tanzanian dish"
              className="w-full h-[320px] md:h-[440px] object-cover relative"
              loading="lazy"
            />
            <div className="absolute -bottom-6 right-6 bg-dark text-white px-6 py-4 shadow-xl">
              <p className="text-3xl font-extrabold font-[family-name:var(--font-heading)]">2026</p>
              <p className="text-xs text-white/60">Serving East Africa</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-dark leading-tight mb-6 font-[family-name:var(--font-heading)]">
              Bringing East Africa's favorite meals to your doorstep
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed mb-4">
              Piki Food started in Dar es Salaam with a simple idea: make food
              delivery fast, reliable, and built for how East Africans actually
              pay and order. Today we partner with hundreds of restaurants
              across Tanzania and Kenya.
            </p>
            <p className="text-gray-500 text-lg leading-relaxed mb-8">
              Every order is tracked in real time, every payment is settled
              securely through M-Pesa, and every rider is trained to deliver
              your food hot and on time.
            </p>

            <ul className="space-y-4 mb-10">
              {highlights.map((item) => (
                <li key={item.text} className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-primary-light flex items-center justify-center shrink-0 mt-0.5">
                    <item.icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-gray-600">{item.text}</span>
                </li>
              ))}
            </ul>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-gray-100 pt-8">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl md:text-3xl font-extrabold text-primary font-[family-name:var(--font-heading)]">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

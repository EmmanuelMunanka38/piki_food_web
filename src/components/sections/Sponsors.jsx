import { motion } from "framer-motion"
import { sponsors } from "../../data/menuItems"

export default function Sponsors() {
  return (
    <section className="bg-[#0F172A] py-16 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <h2 className="text-center text-white text-xl font-semibold mb-10">
          Trusted by Leading Partners
        </h2>
      </motion.div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-[#0F172A] to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-[#0F172A] to-transparent pointer-events-none" />

        <div className="overflow-hidden">
          <div className="flex gap-16 animate-marquee" style={{ width: "max-content" }}>
            {[...sponsors, ...sponsors].map((sponsor, i) => (
              <div
                key={`${sponsor.id}-${i}`}
                className="flex items-center gap-3 text-white/60 hover:text-white transition-colors duration-300"
              >
                <span className="text-lg font-medium tracking-wide whitespace-nowrap">
                  {sponsor.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

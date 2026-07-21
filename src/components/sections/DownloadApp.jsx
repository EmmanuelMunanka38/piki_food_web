import { motion } from "framer-motion";
import { Smartphone, CheckCircle } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.15, ease: "easeOut" },
  }),
};

const floatAnimation = {
  y: [0, -12, 0],
  transition: { duration: 5, repeat: Infinity, ease: "easeInOut" },
};

const dots = [
  { top: "10%", left: "5%", size: 6, delay: 0 },
  { top: "20%", right: "8%", size: 4, delay: 1.2 },
  { top: "70%", left: "12%", size: 5, delay: 0.8 },
  { top: "80%", right: "15%", size: 3, delay: 2 },
  { top: "45%", left: "3%", size: 4, delay: 1.5 },
];

export default function DownloadApp() {
  return (
    <section className="relative bg-gradient-to-br from-dark via-dark to-primary-dark py-20 md:py-28 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

      {dots.map((dot, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-primary/30 pointer-events-none"
          style={{
            top: dot.top,
            left: dot.left,
            right: dot.right,
            width: dot.size,
            height: dot.size,
          }}
          animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.4, 1] }}
          transition={{ duration: 3, delay: dot.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex lg:flex-row flex-col items-center gap-12">
        <div className="flex-1 text-center lg:text-left">
          <motion.div
            className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-1.5 mb-6"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
          >
            <Smartphone className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-white/80">Download Now</span>
          </motion.div>

          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-5"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
          >
            Get the Piki Food App
          </motion.h2>

          <motion.p
            className="text-white/70 text-lg md:text-xl mb-8 max-w-md mx-auto lg:mx-0"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={2}
          >
            Order food on the go. Available for iOS and Android devices.
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-4 justify-center lg:justify-start mb-8"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={3}
          >
            <button className="flex items-center gap-3 bg-white text-dark px-6 py-3.5 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/10 cursor-pointer">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
              <div className="text-left">
                <span className="block text-[10px] leading-tight font-normal opacity-70">Download on the</span>
                <span className="block text-sm leading-tight">App Store</span>
              </div>
            </button>

            <button className="flex items-center gap-3 bg-white text-dark px-6 py-3.5 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/10 cursor-pointer">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M3 20.5v-17c0-.59.34-1.11.84-1.35L13.69 12l-9.85 9.85c-.5-.24-.84-.76-.84-1.35m13.81-5.38L6.05 21.34l8.49-8.49 2.27 2.27m.99-.99l-2.27-2.27 2.27-2.27 3.41 1.95c.63.36.63 1.26 0 1.61l-3.41 1.98M6.05 2.66l10.76 6.22-2.27 2.27-8.49-8.49z"/></svg>
              <div className="text-left">
                <span className="block text-[10px] leading-tight font-normal opacity-70">Get it on</span>
                <span className="block text-sm leading-tight">Google Play</span>
              </div>
            </button>
          </motion.div>

          <motion.div
            className="flex items-center gap-2 justify-center lg:justify-start text-white/60"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={4}
          >
            <CheckCircle className="w-5 h-5 text-primary" />
            <span className="text-sm">Free delivery on your first order</span>
          </motion.div>
        </div>

        <motion.div
          className="flex-1 flex justify-center lg:justify-end"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={2}
        >
          <motion.div animate={floatAnimation} className="-rotate-2">
            <img
              src="/app-screenshot.png"
              alt="Piki Food App Screenshot"
              className="w-72 md:w-80 h-auto drop-shadow-2xl"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

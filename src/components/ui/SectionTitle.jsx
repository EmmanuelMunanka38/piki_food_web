import { motion } from "framer-motion";

export default function SectionTitle({ subtitle, title, description, center = true, dark = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className={`mb-12 md:mb-16 ${center ? "text-center" : ""}`}
    >
      {subtitle && (
        <span className={`inline-block px-4 py-1.5 mb-4 text-sm font-semibold tracking-wide uppercase ${dark ? "text-primary bg-primary/20" : "text-primary bg-primary-light "}`}>
          {subtitle}
        </span>
      )}
      <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4 ${dark ? "text-white" : "text-dark"}`}>
        {title}
      </h2>
      {description && (
        <p className={`text-lg max-w-2xl mx-auto leading-relaxed ${dark ? "text-white/60" : "text-gray-500"}`}>
          {description}
        </p>
      )}
    </motion.div>
  );
}

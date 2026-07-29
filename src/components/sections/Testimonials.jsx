import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star, Quote } from "lucide-react"
import SectionTitle from "../ui/SectionTitle"
import { testimonials } from "../../data/menuItems"

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
}

function TestimonialCard({ testimonial }) {
  return (
    <div className="relative bg-white p-5 lg:p-8 border border-gray-100 shadow-sm">
      <Quote className="absolute top-3 right-3 w-6 h-6 lg:w-8 lg:h-8 text-primary-light" />

      <div className="flex items-center gap-2.5 lg:gap-3 mb-3 lg:mb-5">
        <img
          src={testimonial.avatar}
          alt={testimonial.name}
          className="w-10 h-10 lg:w-14 lg:h-14 rounded-full object-cover"
        />
        <div>
          <h4 className="text-sm lg:text-lg font-bold text-dark">{testimonial.name}</h4>
          <p className="text-xs lg:text-sm text-gray-400">{testimonial.location}</p>
        </div>
      </div>

      <div className="flex gap-0.5 mb-2 lg:mb-3">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star key={i} className="w-3 h-3 lg:w-4 lg:h-4 fill-amber-400 text-amber-400" />
        ))}
      </div>

      <p className="text-gray-500 text-xs lg:text-sm leading-relaxed lg:leading-relaxed line-clamp-4">
        {testimonial.review}
      </p>
    </div>
  )
}

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }, [])

  useEffect(() => {
    const isMobile = window.innerWidth < 768
    if (!isMobile) return

    const interval = setInterval(next, 4000)
    return () => clearInterval(interval)
  }, [next])

  return (
    <section className="bg-white py-8 md:py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 md:mb-8">
          <SectionTitle
            title="Trusted by Thousands Across East Africa"
            description="Here's what our customers in Tanzania and Kenya have to say about ordering through Piki Food — from delivery speed to payment reliability."
          />
        </div>

        {/* Mobile: carousel */}
        <div className="md:hidden overflow-hidden relative">
          <div className="relative w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 300, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <TestimonialCard testimonial={testimonials[currentIndex]} />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-center gap-2 mt-4">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? "bg-primary" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Desktop: grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
        >
          {testimonials.map((testimonial) => (
            <motion.div key={testimonial.id} variants={cardVariants}>
              <TestimonialCard testimonial={testimonial} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

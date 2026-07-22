import { motion } from "framer-motion"
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

export default function Testimonials() {
  return (
    <section className="bg-white py-8 md:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 md:mb-8">
          <SectionTitle
            title="Trusted by Thousands Across East Africa"
            description="Here's what our customers in Tanzania and Kenya have to say about ordering through Piki Food — from delivery speed to payment reliability."
          />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              variants={cardVariants}
              className="relative bg-white p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <Quote className="absolute top-3 right-3 w-6 h-6 text-primary-light" />

              <div className="flex items-center gap-2.5 mb-3">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-sm font-bold text-dark">{testimonial.name}</h4>
                  <p className="text-xs text-gray-400">{testimonial.location}</p>
                </div>
              </div>

              <div className="flex gap-0.5 mb-2">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="text-gray-500 text-xs leading-relaxed line-clamp-4">
                {testimonial.review}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

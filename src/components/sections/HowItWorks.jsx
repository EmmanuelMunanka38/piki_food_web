import { motion } from "framer-motion"
import { Search, ShoppingBag, Heart } from "lucide-react"
import SectionTitle from "../ui/SectionTitle"

const steps = [
  {
    number: 1,
    title: "Browse Menu",
    description: "Explore our wide selection of restaurants and cuisines. Find exactly what you're craving.",
    icon: Search,
  },
  {
    number: 2,
    title: "Place Order",
    description: "Add items to your cart, customize your meal, and securely checkout in seconds.",
    icon: ShoppingBag,
  },
  {
    number: 3,
    title: "Enjoy Meal",
    description: "Sit back and relax while we deliver your delicious food right to your doorstep.",
    icon: Heart,
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const stepVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
}

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          subtitle="How It Works"
          title="Order in 3 Simple Steps"
          description="Getting your favorite food has never been easier"
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="relative flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-0"
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              variants={stepVariants}
              className="relative flex flex-col items-center text-center w-full max-w-xs"
            >
              <div className="relative mb-6">
                <step.icon className="w-9 h-9 text-primary" />
                <span className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shadow-md">
                  {step.number}
                </span>
              </div>
              <h3 className="text-xl font-bold text-dark mb-3">{step.title}</h3>
              <p className="text-gray-500 leading-relaxed max-w-xs">{step.description}</p>

              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[calc(50%+2.5rem)] w-[calc(100%-5rem)] h-0 border-t-2 border-dashed border-gray-300" />
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

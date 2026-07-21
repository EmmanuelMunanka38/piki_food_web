import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Search,
  ShoppingBag,
  Smartphone,
  CreditCard,
  Truck,
  CheckCircle2,
  ArrowRight,
  Zap,
  Shield,
} from "lucide-react";
import SectionTitle from "../components/ui/SectionTitle";
import Button from "../components/ui/Button";

const steps = [
  {
    number: 1,
    title: "Browse & Choose",
    description:
      "Explore hundreds of restaurants across Tanzania and Kenya. Filter by cuisine, rating, delivery time, or price. Our smart search helps you find exactly what you're craving in seconds.",
    icon: Search,
  },
  {
    number: 2,
    title: "Customize & Order",
    description:
      "Add items to your cart, customize your meals with special instructions, and choose your preferred delivery time. Our intuitive interface makes ordering effortless.",
    icon: ShoppingBag,
  },
  {
    number: 3,
    title: "Pay with M-Pesa",
    description:
      "Checkout securely using M-Pesa mobile money. Just enter your phone number, approve the STK push on your phone, and you're done. No cards needed.",
    icon: CreditCard,
  },
  {
    number: 4,
    title: "Track & Enjoy",
    description:
      "Watch your order in real-time as it moves from the restaurant to your door. Our riders keep your food hot and deliver it with a smile.",
    icon: Truck,
  },
];

const mpesaFeatures = [
  {
    title: "STK Push Integration",
    description:
      "Seamless checkout with M-Pesa STK Push. No app switching, no entering codes manually. The payment prompt appears directly on your phone screen.",
    icon: Smartphone,
  },
  {
    title: "Instant Confirmation",
    description:
      "Orders are confirmed within seconds of payment. Our API receives real-time callbacks from Safaricom and Vodacom M-Pesa gateways.",
    icon: Zap,
  },
  {
    title: "Secure & Encrypted",
    description:
      "All transactions are processed through Safaricom's and Vodacom's certified M-Pesa APIs with bank-level encryption. Your financial data is never stored on our servers.",
    icon: Shield,
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function HowItWorksPage() {
  return (
    <div className="pt-20">
      <section
        id="how-it-works"
        className="relative bg-dark py-20 md:py-28 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1600&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-dark/80" />
        <div className="relative max-w-[1440px] mx-auto px-5 md:px-8 lg:px-12">
          <SectionTitle
            subtitle="How It Works"
            title="Order in 4 Simple Steps"
            description="From browsing to your first bite, we've made food delivery effortless"
            dark
          />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {steps.map((step) => (
              <motion.div
                key={step.number}
                variants={itemVariants}
                className="relative bg-white/10 backdrop-blur-sm border border-white/10 p-6 hover:bg-white/15 transition-colors duration-300"
              >
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 bg-primary flex items-center justify-center shrink-0">
                    <step.icon className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-4xl font-extrabold text-white/20 font-[family-name:var(--font-heading)]">
                    0{step.number}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-3 font-[family-name:var(--font-heading)]">
                  {step.title}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="bg-off-white py-20 md:py-28">
        <div className="max-w-[1440px] mx-auto px-5 md:px-8 lg:px-12">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <motion.div
              className="flex-1"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold text-primary bg-primary-light tracking-wide uppercase">
                Payments
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-dark leading-tight mb-6 font-[family-name:var(--font-heading)]">
                Pay with M-Pesa
                <br />
                <span className="text-primary">It's that simple.</span>
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed mb-8">
                We've integrated directly with Safaricom and Vodacom M-Pesa APIs
                to give you the fastest, most secure checkout experience. No credit
                cards, no bank accounts needed — just your phone number.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-dark">
                      Safaricom Daraja API
                    </span>
                    <p className="text-sm text-gray-500">
                      Direct integration with Safaricom's M-Pesa for Kenya. Supports
                      STK Push, C2B, and B2C disbursements.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-dark">
                      Vodacom M-Pesa API
                    </span>
                    <p className="text-sm text-gray-500">
                      Native integration with Vodacom's M-Pesa for Tanzania. Instant
                      payment confirmation via callback URLs.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-dark">
                      Real-time Webhooks
                    </span>
                    <p className="text-sm text-gray-500">
                      Our backend processes M-Pesa callbacks instantly, updating
                      order status in real-time with zero delays.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="flex-1 w-full"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="space-y-5">
                {mpesaFeatures.map((feature, i) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-4 bg-white p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="w-12 h-12 bg-primary flex items-center justify-center shrink-0">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-dark mb-1 font-[family-name:var(--font-heading)]">
                        {feature.title}
                      </h4>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-dark py-20 md:py-28">
        <div className="max-w-[1440px] mx-auto px-5 md:px-8 lg:px-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-[family-name:var(--font-heading)]">
            Ready to order?
          </h2>
          <p className="text-white/60 text-lg mb-8 max-w-xl mx-auto">
            Join thousands of happy customers across Tanzania and Kenya who
            trust Piki Food for their daily meals.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/menu">
              <Button size="lg">
                Browse Menu
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/download">
              <Button variant="secondary" size="lg" className="border-white/20 text-white hover:bg-white/10">
                Download App
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

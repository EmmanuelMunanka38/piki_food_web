import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  ArrowRight,
  BadgeCheck,
  Building2,
  ChevronDown,
} from "lucide-react";
import SectionTitle from "../components/ui/SectionTitle";
import Button from "../components/ui/Button";

const plans = [
  {
    name: "Free tier",
    price: 0,
    period: "14 days",
    tagline: "Try everything free for 14 days — no card required.",
    cta: "Start free tier",
    popular: false,
    features: [
      "Restaurant profile & menu listing",
      "Up to 20 active menu items",
      "Receive orders via app & SMS",
      "Cash on delivery payments",
      "Standard search placement",
      "Email support",
    ],
  },
  {
    name: "Growth",
    price: 50000,
    period: "month",
    tagline: "For growing restaurants ready to scale.",
    cta: "Choose Growth",
    popular: true,
    features: [
      "Everything in Free tier",
      "Unlimited menu items",
      "Online payments (STK Push)",
      "Priority search placement",
      "Featured in Popular Dishes",
      "Order analytics dashboard",
      "WhatsApp & email support",
    ],
  },
  {
    name: "Pro",
    price: 90000,
    period: "month",
    tagline: "For established restaurants that want maximum exposure.",
    cta: "Go Pro",
    popular: false,
    features: [
      "Everything in Growth",
      "Top placement on home & search",
      "Exclusive marketing campaigns",
      "Custom restaurant page design",
      "Multi-branch management",
      "Dedicated account manager",
      "24/7 priority support",
    ],
  },
];

const enterpriseFeatures = [
  "Custom plan built around your business",
  "Dedicated API & white-label integration",
  "Multi-location & franchise management",
  "Tailored onboarding & staff training",
  "Dedicated account & support team",
];

const faqs = [
  {
    q: "How long does the free tier last?",
    a: "The Free tier gives you 14 full days to explore everything on the platform — no card required. After that, you can pick a plan or leave anytime.",
  },
  {
    q: "Do I need to pay a setup fee?",
    a: "No. Every plan — including Free tier — comes with no setup fees and no hidden charges. You only pay your monthly subscription if you choose to upgrade.",
  },
  {
    q: "How do I receive payments from customers?",
    a: "All M-Pesa payments are settled directly to your registered business number through weekly payouts. Cash on delivery stays with your restaurant as usual.",
  },
  {
    q: "Can I change plans later?",
    a: "Absolutely. Upgrade or downgrade anytime, and we'll prorate the difference. Your menu, reviews, and order history carry over automatically.",
  },
  {
    q: "Is there a long-term contract?",
    a: "No contracts and no lock-ins. Plans are billed monthly and you can cancel anytime with one click.",
  },
  {
    q: "What happens when my orders grow?",
    a: "Your plan scales with you. When you need more visibility, faster payouts, or multi-branch support, we'll help you move to Growth, Pro, or Enterprise.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
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

export default function PricingPage() {
  return (
    <div>
      <section
        className="relative bg-dark pt-28 pb-20 md:pt-32 md:pb-28 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1600&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-dark/85" />
        <div className="relative max-w-[1440px] mx-auto px-5 md:px-8 lg:px-12">
          <SectionTitle
            title="Plans that grow with your restaurant"
            description="Try it free for 14 days, then upgrade when you're ready. No setup fees, no hidden charges, cancel anytime."
            dark
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold">
              <BadgeCheck className="w-4 h-4" /> No setup fees
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/10 text-white/80 text-sm font-medium">
              Billed monthly
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/10 text-white/80 text-sm font-medium">
              Prices in TZS
            </span>
          </motion.div>
        </div>
      </section>

      <section className="bg-white py-20 md:py-28">
        <div className="max-w-[1440px] mx-auto px-5 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 lg:items-center">
            {plans.map((plan) => (
              <motion.div
                key={plan.name}
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className={plan.popular ? "lg:-mt-6 lg:mb-6" : ""}
              >
                <div
                  className={`relative h-full flex flex-col p-10 md:p-12 border transition-all duration-300 ${
                    plan.popular
                      ? "bg-dark border-primary shadow-2xl shadow-primary/20 text-white"
                      : "bg-white border-gray-100 shadow-sm hover:shadow-xl"
                  }`}
                >
                  {plan.popular && (
                    <span className="absolute -top-4 right-6 px-4 py-1.5 bg-primary text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-primary/30">
                      Most Popular
                    </span>
                  )}

                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold font-[family-name:var(--font-heading)]">
                      {plan.name}
                    </h3>
                  </div>

                  <div className="flex items-end gap-1.5 mb-3">
                    <span className="text-sm font-semibold pb-2 text-gray-400">
                      TSh
                    </span>
                    <span className="text-6xl font-extrabold tracking-tight font-[family-name:var(--font-heading)]">
                      {plan.price.toLocaleString("en-US")}
                    </span>
                    <span
                      className={`text-sm mb-2 ${
                        plan.popular ? "text-white/60" : "text-gray-400"
                      }`}
                    >
                      / {plan.period}
                    </span>
                  </div>

                  <p
                    className={`text-sm mb-10 ${
                      plan.popular ? "text-white/70" : "text-gray-500"
                    }`}
                  >
                    {plan.tagline}
                  </p>

                  <ul className="space-y-4 mb-10">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 text-sm"
                      >
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span
                          className={
                            plan.popular ? "text-white/85" : "text-dark/80"
                          }
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto">
                    <Link to="/signup" className="block">
                      <Button
                        variant={plan.popular ? "primary" : "secondary"}
                        className="w-full"
                      >
                        {plan.cta} <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-dark py-20 md:py-28">
        <div className="max-w-[1440px] mx-auto px-5 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 text-sm font-semibold text-primary bg-primary/20 tracking-wide uppercase">
                <Building2 className="w-4 h-4" /> Enterprise
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-6 font-[family-name:var(--font-heading)]">
                Need something more?
                <br />
                <span className="text-primary">We build it with you.</span>
              </h2>
              <p className="text-white/60 text-lg leading-relaxed mb-8">
                Custom solutions for restaurant chains, hotels, and food
                businesses with advanced needs. Let's design a plan around your
                operations — no matter how complex.
              </p>

              <ul className="space-y-4 mb-10">
                {enterpriseFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-white/85">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link to="/contact">
                <Button size="lg">
                  Talk to our team <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-white p-8 md:p-10 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-dark font-[family-name:var(--font-heading)]">
                    Enterprise
                  </h3>
                  <span className="px-3 py-1 bg-primary-light text-primary text-xs font-bold uppercase tracking-wider">
                    Custom
                  </span>
                </div>

                <div className="flex items-end gap-1.5 mb-2">
                  <span className="text-3xl md:text-4xl font-extrabold text-dark tracking-tight font-[family-name:var(--font-heading)]">
                    Let's talk
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-8">
                  Tailored pricing based on locations, order volume, and
                  integrations.
                </p>

                <ul className="space-y-3 mb-8">
                  {[
                    "Dedicated API access",
                    "White-label ordering page",
                    "Franchise & multi-location tools",
                    "Custom reporting & dashboards",
                    "SLA-backed support",
                  ].map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-dark/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link to="/contact" className="block">
                  <Button variant="dark" className="w-full">
                    Contact sales <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-5 md:px-8 lg:px-12">
          <SectionTitle
            title="Frequently asked questions"
            description="Everything you need to know before you get started."
          />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="space-y-4"
          >
            {faqs.map((faq) => (
              <motion.details
                key={faq.q}
                variants={itemVariants}
                className="group bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <summary className="flex items-center justify-between gap-4 px-6 py-5 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  <span className="font-semibold text-dark">{faq.q}</span>
                  <ChevronDown className="w-5 h-5 text-primary shrink-0 transition-transform duration-300 group-open:rotate-180" />
                </summary>
                <p className="px-6 pb-5 text-sm text-gray-500 leading-relaxed">
                  {faq.a}
                </p>
              </motion.details>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="relative bg-dark py-20 md:py-28 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="relative max-w-[1440px] mx-auto px-5 md:px-8 lg:px-12 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 font-[family-name:var(--font-heading)]">
            Ready to grow your restaurant?
          </h2>
          <p className="text-white/60 text-lg mb-8 max-w-xl mx-auto">
            Join hundreds of restaurants already growing with Piki Food. Start
            your 14-day free tier — no setup fees, no contracts.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup">
              <Button size="lg">
                Start free tier
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline-light" size="lg">
                Contact sales
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

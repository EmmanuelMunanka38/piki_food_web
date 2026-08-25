import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Cookie } from "lucide-react";

const sections = [
  {
    title: "What Are Cookies",
    content:
      "Cookies are small text files that are placed on your device (computer, smartphone, or tablet) when you visit a website or use an application. They are widely used to make websites work more efficiently, enhance user experience, and provide information to website owners. Cookies cannot run programs or deliver viruses to your device.",
  },
  {
    title: "How We Use Cookies",
    content:
      "Piki Food uses cookies and similar tracking technologies to improve your experience on our platform. Cookies help us remember your preferences, understand how you interact with our service, keep you logged in securely, personalize content and advertisements, and analyze website traffic to improve our offerings.",
  },
  {
    title: "Types of Cookies We Use",
    content:
      "Essential Cookies: These cookies are necessary for the platform to function properly. They enable core features such as secure login, order management, and payment processing via M-Pesa. Without these cookies, certain services cannot be provided.\n\nPerformance Cookies: These cookies help us understand how users interact with our platform by collecting anonymous information about page visits, load times, and error messages. This data helps us optimize performance and improve user experience.\n\nFunctional Cookies: These cookies remember your preferences and choices, such as your preferred language, saved addresses, and favorite restaurants, to provide a personalized experience.\n\nAdvertising Cookies: With your consent, these cookies track your browsing activity to deliver relevant advertisements and measure the effectiveness of marketing campaigns.",
  },
  {
    title: "Third-Party Cookies",
    content:
      "We may allow trusted third-party services to place cookies on your device for analytics and advertising purposes. These include Google Analytics for understanding platform usage, payment processors for secure transaction handling, and advertising partners for targeted marketing. These third parties have their own privacy policies governing cookie usage.",
  },
  {
    title: "How Long Cookies Stay",
    content:
      "Session cookies are temporary and are deleted when you close your browser. Persistent cookies remain on your device for a set period or until you manually delete them. The duration varies depending on the cookie purpose. Essential cookies typically persist for the duration of your session, while preference cookies may last up to 12 months.",
  },
  {
    title: "Your Cookie Choices",
    content:
      "When you first visit Piki Food, you will be presented with a cookie consent banner that allows you to accept or decline non-essential cookies. You can change your preferences at any time through your browser settings. Most browsers allow you to block or delete cookies, though doing so may affect the functionality of our platform. You can also use your browser's incognito or private mode to limit cookie tracking.",
  },
  {
    title: "How to Manage Cookies in Your Browser",
    content:
      "You can control and manage cookies through your browser settings. In most browsers, you can view cookies stored on your device, delete individual or all cookies, block cookies from specific websites, block all third-party cookies, and set preferences for cookie notifications. Instructions are typically found in the 'Help' or 'Settings' section of your browser.",
  },
  {
    title: "Updates to This Policy",
    content:
      "We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our data practices. Any changes will be posted on this page with an updated revision date. For significant changes, we may provide additional notice through our platform or via email.",
  },
  {
    title: "Contact Us",
    content:
      "If you have any questions about our use of cookies or this Cookie Policy, please contact us at privacy@pikifood.co.tz or call +255 740 336 972. You can also write to us at Mikocheni, Dar es Salaam, Tanzania.",
  },
];

export default function CookiePolicyPage() {
  return (
    <div className="pt-20">
      <section className="py-16 md:py-24 bg-white">
        <div className="mx-auto max-w-3xl px-5 md:px-8 lg:px-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-primary transition-colors duration-200 mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <Cookie className="w-5 h-5 text-primary shrink-0" />
            <div>
              <p className="text-xs font-semibold text-primary uppercase tracking-wider">
                Legal
              </p>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-dark font-[family-name:var(--font-heading)] leading-tight mb-4">
            Cookie Policy
          </h1>
          <p className="text-gray-400 text-sm mb-10">
            Last updated: July 28, 2026
          </p>

          <p className="text-gray-500 text-base leading-relaxed mb-12">
            This Cookie Policy explains how Piki Food uses cookies and similar tracking technologies
            on our website and mobile application. It explains what cookies are, how we use them,
            and your choices regarding their use. By continuing to use our platform, you agree to
            our use of cookies as described in this policy.
          </p>

          <div className="space-y-10">
            {sections.map((section, i) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <h2 className="text-xl font-bold text-dark font-[family-name:var(--font-heading)] mb-3">
                  {i + 1}. {section.title}
                </h2>
                <p className="text-gray-500 text-base leading-relaxed whitespace-pre-line">
                  {section.content}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

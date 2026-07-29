import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield } from "lucide-react";

const sections = [
  {
    title: "Information We Collect",
    content:
      "When you use Piki Food, we collect information you provide directly, such as your name, phone number, email address, delivery address, and payment details processed through M-Pesa. We also automatically collect certain data when you use our platform, including your device information, IP address, browsing activity, and location data to facilitate delivery services.",
  },
  {
    title: "How We Use Your Information",
    content:
      "We use the information we collect to process and deliver your orders, communicate with you about your orders and account, improve our services, personalize your experience, process payments securely via M-Pesa, send you updates and promotional offers (with your consent), and ensure the safety and security of our platform.",
  },
  {
    title: "Payment Data & M-Pesa Integration",
    content:
      "All payments processed through Piki Food are handled via Safaricom's and Vodacom's certified M-Pesa APIs using bank-level encryption. We do not store your M-Pesa PIN or financial credentials on our servers. Transaction data is processed in real time and verified through encrypted channels. Payment confirmation details are retained for order reconciliation purposes only.",
  },
  {
    title: "Location Data",
    content:
      "We collect location data to enable real-time order tracking, match you with nearby restaurants, and calculate accurate delivery times and fees. Location data is only accessed when you have granted permission through your device settings. You can disable location access at any time, though this may affect certain features of the service.",
  },
  {
    title: "Information Sharing",
    content:
      "We do not sell your personal information to third parties. We may share your data with trusted partners who help us operate our platform, including delivery riders (for order fulfillment), restaurant partners (to prepare and fulfill your orders), payment processors (M-Pesa for transaction handling), and service providers (cloud infrastructure, analytics, and customer support). All partners are contractually bound to protect your data.",
  },
  {
    title: "Data Security",
    content:
      "We implement industry-standard security measures including SSL/TLS encryption for all data transmissions, encrypted storage for sensitive information, regular security audits, and strict access controls. Our systems are designed to protect your personal information against unauthorized access, alteration, disclosure, or destruction.",
  },
  {
    title: "Your Rights",
    content:
      "You have the right to access the personal data we hold about you, request corrections to inaccurate data, request deletion of your data (subject to legal obligations), withdraw consent for marketing communications at any time, and request a copy of your data in a portable format. To exercise any of these rights, please contact our Data Protection Officer at privacy@pikifood.co.tz.",
  },
  {
    title: "Data Retention",
    content:
      "We retain your personal information for as long as your account is active or as needed to provide you with our services. We may retain certain data longer to comply with legal obligations, resolve disputes, and enforce our agreements. When data is no longer needed, we securely delete or anonymize it.",
  },
  {
    title: "Changes to This Policy",
    content:
      "We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by posting the updated policy on this page and, where appropriate, through email or in-app notifications. We encourage you to review this policy periodically.",
  },
  {
    title: "Contact Us",
    content:
      "If you have questions about this Privacy Policy or our data practices, please contact our Data Protection Officer at privacy@pikifood.co.tz, call us at +255 740 336 972, or write to us at Mikocheni, Dar es Salaam, Tanzania. We aim to respond to all inquiries within 48 hours.",
  },
];

export default function PrivacyPolicyPage() {
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
            <div className="w-10 h-10 bg-primary-light flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs font-semibold text-primary uppercase tracking-wider">
                Legal
              </p>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-dark font-[family-name:var(--font-heading)] leading-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-400 text-sm mb-10">
            Last updated: July 28, 2026
          </p>

          <p className="text-gray-500 text-base leading-relaxed mb-12">
            At Piki Food, we take your privacy seriously. This Privacy Policy explains how we collect,
            use, disclose, and safeguard your information when you use our food delivery platform,
            website, and mobile application. By using Piki Food, you consent to the practices described
            in this policy.
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
                <p className="text-gray-500 text-base leading-relaxed">
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

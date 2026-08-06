import { useState } from "react";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import SectionTitle from "../ui/SectionTitle";
import Button from "../ui/Button";
import { contactService } from "../../services/contact";

const contactInfo = [
  {
    icon: Phone,
    label: "Phone",
    value: "+255 740 336 972",
  },
  {
    icon: Mail,
    label: "Email",
    value: "info@pikifood.co.tz",
  },
  {
    icon: MapPin,
    label: "Address",
    value: "Mikocheni, Dar es Salaam, Tanzania",
  },
  {
    icon: Clock,
    label: "Hours",
    value: "Mon-Sat 8:00 AM - 10:00 PM",
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
}

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [submitError, setSubmitError] = useState("")

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    setSubmitError("")
    setSent(false)
    try {
      await contactService.sendMessage(formData)
      setSent(true)
      setFormData({ name: "", email: "", subject: "", message: "" })
    } catch (err) {
      setSubmitError(err?.message || "Failed to send your message. Please try again.")
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&h=1080&fit=crop"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/60" />

        <div className="relative z-10 w-full max-w-4xl mx-auto px-5 md:px-8 text-center py-28 md:py-32">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary text-white text-xs font-semibold uppercase tracking-wider mb-6"
          >
            <Phone className="w-3.5 h-3.5" /> We're here to help
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold text-white font-[family-name:var(--font-heading)] leading-tight"
          >
            Get in Touch
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/75 text-base md:text-lg mt-5 max-w-2xl mx-auto leading-relaxed"
          >
            Have questions about your order, partnership, or our services? We'd love to hear
            from you. Our team responds within a few hours.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <a
              href="tel:+255740336972"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold hover:bg-primary-dark transition-colors"
            >
              <Phone className="w-4 h-4" /> Call +255 740 336 972
            </a>
            <a
              href="mailto:info@pikifood.co.tz"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-dark font-semibold hover:bg-gray-100 transition-colors"
            >
              <Mail className="w-4 h-4" /> Email Us
            </a>
          </motion.div>
        </div>
      </section>

      <section id="contact" className="bg-[#F8FAFC] py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Send us a Message"
            description="Fill out the form and we'll get back to you as soon as possible"
          />

          <div className="flex flex-col lg:flex-row gap-12">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="flex-1"
            >
              <motion.form
                variants={itemVariants}
                onSubmit={handleSubmit}
                className="bg-white p-8 shadow-sm border border-gray-100"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <motion.div variants={itemVariants}>
                    <label htmlFor="name" className="block text-sm font-medium text-dark mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-dark placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition outline-none"
                    />
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <label htmlFor="email" className="block text-sm font-medium text-dark mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-dark placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition outline-none"
                    />
                  </motion.div>
                </div>

                <motion.div variants={itemVariants} className="mb-6">
                  <label htmlFor="subject" className="block text-sm font-medium text-dark mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help?"
                    className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-dark placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition outline-none"
                  />
                </motion.div>

                <motion.div variants={itemVariants} className="mb-8">
                  <label htmlFor="message" className="block text-sm font-medium text-dark mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Write your message here..."
                    className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-dark placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition outline-none resize-none"
                  />
                </motion.div>

                {sent && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 flex items-start gap-3 px-4 py-3 bg-green-50 border border-green-200"
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-green-700">Message sent successfully!</p>
                      <p className="text-xs text-green-600 mt-0.5">
                        We've received your message and will get back to you soon.
                      </p>
                    </div>
                  </motion.div>
                )}

                {submitError && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 flex items-start gap-3 px-4 py-3 bg-red-50 border border-red-200"
                  >
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-red-700">Could not send your message</p>
                      <p className="text-xs text-red-600 mt-0.5">{submitError}</p>
                    </div>
                  </motion.div>
                )}

                <motion.div variants={itemVariants}>
                  <Button type="submit" variant="primary" className="w-full" disabled={sending}>
                    {sending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </motion.div>
              </motion.form>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="flex-1 flex flex-col gap-6"
            >
              {contactInfo.map((info) => (
                <motion.div
                  key={info.label}
                  variants={itemVariants}
                  className="flex items-start gap-4 bg-white border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="w-12 h-12 bg-primary-light flex items-center justify-center shrink-0">
                    <info.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-dark mb-1">{info.label}</h4>
                    <p className="text-gray-500">{info.value}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}

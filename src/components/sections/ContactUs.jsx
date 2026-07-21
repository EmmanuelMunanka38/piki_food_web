import { useState } from "react"
import { motion } from "framer-motion"
import { Phone, Mail, MapPin, Clock, Globe, MessageCircle, Camera, Music2, Send } from "lucide-react"
import SectionTitle from "../ui/SectionTitle"
import Button from "../ui/Button"

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

const socialLinks = [
  { icon: Globe, label: "Facebook", href: "#" },
  { icon: MessageCircle, label: "Twitter", href: "#" },
  { icon: Camera, label: "Instagram", href: "#" },
  { icon: Music2, label: "TikTok", href: "#" },
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

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    setFormData({ name: "", email: "", subject: "", message: "" })
  }

  return (
    <section id="contact" className="bg-[#F8FAFC] py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Get in Touch"
          description="Have questions? We'd love to hear from you"
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
              className="bg-white rounded-2xl p-8 shadow-sm"
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
                    placeholder="name"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-dark placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition outline-none"
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
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-dark placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition outline-none"
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
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-dark placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition outline-none"
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
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-dark placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition outline-none resize-none"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <Button type="submit" variant="primary" className="w-full">
                  <Send className="w-4 h-4" />
                  Send Message
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
                className="flex items-start gap-4"
              >
                <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center shrink-0">
                  <info.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-dark mb-1">{info.label}</h4>
                  <p className="text-gray-500">{info.value}</p>
                </div>
              </motion.div>
            ))}

            <motion.div variants={itemVariants} className="pt-6">
              <h4 className="font-semibold text-dark mb-4">Follow Us</h4>
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 bg-dark rounded-full flex items-center justify-center text-white hover:bg-primary transition-colors duration-300"
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

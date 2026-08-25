import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Highlight, themes } from "prism-react-renderer";
import {
  Code2,
  Zap,
  Shield,
  Globe,
  Terminal,
  BookOpen,
  CheckCircle2,
  ArrowRight,
  Copy,
  Check,
  Smartphone,
  MapPin,
  BarChart3,
  Clock,
  Users,
} from "lucide-react";
import SectionTitle from "../components/ui/SectionTitle";
import Button from "../components/ui/Button";

const features = [
  {
    icon: Zap,
    title: "Developer First",
    description:
      "Built by developers, for developers. Clean REST endpoints, consistent response formats, and SDKs in popular languages.",
  },
  {
    icon: Code2,
    title: "Easy Integration",
    description:
      "Integrate food delivery into your app in under 30 minutes. Our documentation includes copy-paste code samples.",
  },
  {
    icon: Shield,
    title: "Secure by Default",
    description:
      "OAuth 2.0 authentication, rate limiting, and webhook signature verification. Your API keys are encrypted at rest.",
  },
  {
    icon: Globe,
    title: "Multi-Country",
    description:
      "Single API supports Tanzania and Kenya. Automatic currency conversion, local M-Pesa integration, and region-aware routing.",
  },
  {
    icon: BarChart3,
    title: "Real-time Data",
    description:
      "Live order tracking via WebSocket, real-time menu updates, and instant delivery status callbacks.",
  },
  {
    icon: Smartphone,
    title: "Mobile SDKs",
    description:
      "Native SDKs for React Native, Flutter, and Swift. Pre-built UI components for order flow, tracking, and payments.",
  },
];

const endpoints = [
  {
    method: "GET",
    path: "/api/v1/restaurants",
    description: "List all restaurants in a city",
    tag: "Restaurants",
  },
  {
    method: "GET",
    path: "/api/v1/restaurants/:id/menu",
    description: "Get restaurant menu with categories",
    tag: "Menu",
  },
  {
    method: "POST",
    path: "/api/v1/orders",
    description: "Create a new food order",
    tag: "Orders",
  },
  {
    method: "GET",
    path: "/api/v1/orders/:id/track",
    description: "Real-time order tracking via WebSocket",
    tag: "Tracking",
  },
  {
    method: "POST",
    path: "/api/v1/payments/mpesa",
    description: "Initiate M-Pesa STK Push payment",
    tag: "Payments",
  },
  {
    method: "GET",
    path: "/api/v1/delivery/zones",
    description: "Get available delivery zones and ETAs",
    tag: "Delivery",
  },
  {
    method: "POST",
    path: "/api/v1/webhooks",
    description: "Register webhook for order events",
    tag: "Webhooks",
  },
  {
    method: "GET",
    path: "/api/v1/analytics/orders",
    description: "Order analytics and insights",
    tag: "Analytics",
  },
];

const steps = [
  {
    number: "01",
    title: "Get Your API Key",
    description:
      "Sign up for a free developer account and get your API keys instantly. No approval wait time.",
  },
  {
    number: "02",
    title: "Install the SDK",
    description:
      "Choose your language and install our SDK via npm, pip, or Maven. Works with Node.js, Python, Java, and more.",
  },
  {
    number: "03",
    title: "Make Your First Call",
    description:
      "Fetch restaurants, create orders, and process payments with just a few lines of code.",
  },
  {
    number: "04",
    title: "Go Live",
    description:
      "Switch to production keys, register your webhooks, and start accepting real orders.",
  },
];

const methodColors = {
  GET: "bg-emerald-100 text-emerald-700",
  POST: "bg-blue-100 text-blue-700",
  PUT: "bg-amber-100 text-amber-700",
  DELETE: "bg-red-100 text-red-700",
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

function CodeBlock({ title, language, code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = code;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-[#1e1e1e] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#2d2d2d] border-b border-white/5">
        <span className="text-xs text-white/50">{title}</span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-white/30 uppercase tracking-wider">
            {language}
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 text-[11px] text-white/50 hover:text-white/80 hover:bg-white/5 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3" /> Copied
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" /> Copy
              </>
            )}
          </button>
        </div>
      </div>
      <Highlight theme={themes.vsDark} code={code.trim()} language={language}>
        {({ style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className="p-4 overflow-x-auto text-sm leading-relaxed"
            style={{ ...style, background: "transparent" }}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                <span className="inline-block w-8 text-right mr-4 text-white/20 select-none text-xs">
                  {i + 1}
                </span>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
}

export default function MsosiApiPage() {
  return (
    <div className="pt-20">
      <section className="bg-dark py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-[120px]" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-primary rounded-full blur-[150px]" />
        </div>

        <div className="relative max-w-[1440px] mx-auto px-5 md:px-8 lg:px-12">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/10 mb-6"
            >
              <Terminal className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-white/80">
                Developer Platform
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white leading-tight mb-6 font-[family-name:var(--font-heading)]"
            >
              Build with
              <br />
              <span className="text-primary">Msosi API</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-white/60 mb-8 max-w-xl"
            >
              The complete food delivery API for East Africa. Restaurants, orders,
              payments, and real-time tracking — all in one RESTful API.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Button size="lg">
                <Code2 className="w-4 h-4" />
                Get API Key
              </Button>
              <a href="#docs">
                <Button variant="outline-light" size="lg">
                  <BookOpen className="w-4 h-4" />
                  Read Docs
                </Button>
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-8 flex items-center gap-6 text-sm text-white/40"
            >
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                Free tier available
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                99.9% uptime
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 md:py-28">
        <div className="max-w-[1440px] mx-auto px-5 md:px-8 lg:px-12">
          <SectionTitle
            subtitle="Why Msosi API"
            title="Built for Speed & Simplicity"
            description="Integrate food delivery into any app in minutes, not weeks"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300"
              >
                <feature.icon className="w-6 h-6 text-primary mb-4" />
                <h3 className="text-lg font-bold text-dark mb-2 font-[family-name:var(--font-heading)]">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="docs" className="bg-off-white py-20 md:py-28">
        <div className="max-w-[1440px] mx-auto px-5 md:px-8 lg:px-12">
          <SectionTitle
            subtitle="Quick Start"
            title="Up and Running in Minutes"
            description="Follow these 4 steps to integrate Msosi API into your app"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                <span className="text-5xl font-extrabold text-primary/10 font-[family-name:var(--font-heading)]">
                  {step.number}
                </span>
                <h3 className="text-lg font-bold text-dark mt-2 mb-2 font-[family-name:var(--font-heading)]">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold text-dark mb-4 font-[family-name:var(--font-heading)]">
                1. Install the SDK
              </h3>
              <CodeBlock
                title="Terminal"
                language="bash"
                code={`# Node.js
npm install @msosi/api-sdk

# Python
pip install msosi-api

# Or use the REST API directly with curl`}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold text-dark mb-4 font-[family-name:var(--font-heading)]">
                2. Initialize the Client
              </h3>
              <CodeBlock
                title="app.js"
                language="javascript"
                code={`import { Msosi } from '@msosi/api-sdk';

const msosi = new Msosi({
  apiKey: 'msosi_live_xxxxxxxxxxxxxxxx',
  region: 'east-africa', // Tanzania & Kenya
});`}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold text-dark mb-4 font-[family-name:var(--font-heading)]">
                3. Fetch Restaurants
              </h3>
              <CodeBlock
                title="app.js"
                language="javascript"
                code={`// Get restaurants in Dar es Salaam
const restaurants = await msosi.restaurants.list({
  city: 'dar-es-salaam',
  cuisine: 'tanzanian',
  rating_min: 4.0,
  open_now: true,
  limit: 20,
});

console.log(restaurants.data);
// [
//   {
//     id: "rst_abc123",
//     name: "Mama Ntilie Restaurant",
//     rating: 4.5,
//     delivery_time: "30-45 min",
//     cuisine: ["Tanzanian", "BBQ"],
//     ...
//   },
//   ...
// ]`}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold text-dark mb-4 font-[family-name:var(--font-heading)]">
                4. Create an Order
              </h3>
              <CodeBlock
                title="app.js"
                language="javascript"
                code={`const order = await msosi.orders.create({
  restaurant_id: 'rst_abc123',
  items: [
    {
      menu_item_id: 'itm_chips_mayai',
      quantity: 2,
      special_instructions: 'Extra chili sauce',
    },
    {
      menu_item_id: 'itm_mishkaki',
      quantity: 1,
    },
  ],
  delivery_address: {
    street: '42 Libra Street',
    area: 'Mikocheni',
    city: 'Dar es Salaam',
    coordinates: { lat: -6.7734, lng: 39.2417 },
  },
  payment_method: 'mpesa',
  phone_number: '+255712345678',
});

console.log(order.id);        // "ord_xyz789"
console.log(order.total);     // 27000 (TZS)
console.log(order.status);    // "pending_payment"`}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold text-dark mb-4 font-[family-name:var(--font-heading)]">
                5. Process M-Pesa Payment
              </h3>
              <CodeBlock
                title="app.js"
                language="javascript"
                code={`// Initiate M-Pesa STK Push
const payment = await msosi.payments.mpesa({
  order_id: 'ord_xyz789',
  phone_number: '+255712345678',
  amount: 27000,
  currency: 'TZS',
});

// Payment sends STK push to customer's phone
// Webhook confirms payment automatically

console.log(payment.status);   // "pending"
console.log(payment.checkout); // "STK push sent"`}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold text-dark mb-4 font-[family-name:var(--font-heading)]">
                6. Track in Real-time
              </h3>
              <CodeBlock
                title="app.js"
                language="javascript"
                code={`// WebSocket for live order tracking
const tracker = msosi.tracking.subscribe('ord_xyz789');

tracker.on('status', (data) => {
  console.log(data.status);
  // "confirmed" → "preparing" → "picked_up" → "delivered"

  console.log(data.driver.location);
  // { lat: -6.7750, lng: 39.2430 }

  console.log(data.eta_minutes);
  // 12
});

tracker.on('delivered', () => {
  console.log('Order delivered!');
  tracker.disconnect();
});`}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold text-dark mb-4 font-[family-name:var(--font-heading)]">
                7. Register Webhooks
              </h3>
              <CodeBlock
                title="app.js"
                language="javascript"
                code={`// Get notified of order events
await msosi.webhooks.create({
  url: 'https://yourapp.com/api/msosi-webhook',
  events: [
    'order.confirmed',
    'order.preparing',
    'order.picked_up',
    'order.delivered',
    'payment.completed',
    'payment.failed',
  ],
  secret: 'whsec_your_webhook_secret',
});

// Verify webhook signatures in your handler
import { verifyWebhook } from '@msosi/api-sdk';

app.post('/api/msosi-webhook', (req, res) => {
  const isValid = verifyWebhook(req.body, req.headers, 'whsec_your_webhook_secret');

  if (!isValid) return res.status(401).send('Invalid signature');

  const { event, data } = req.body;

  switch (event) {
    case 'order.delivered':
      sendThankYouEmail(data.customer_email);
      break;
    case 'payment.failed':
      notifySupport(data.order_id);
      break;
  }

  res.status(200).send('OK');
});`}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold text-dark mb-4 font-[family-name:var(--font-heading)]">
                Python Example
              </h3>
              <CodeBlock
                title="main.py"
                language="python"
                code={`from msosi import MsosiClient

client = MsosiClient(api_key="msosi_live_xxxxxxxxxxxxxxxx")

# List restaurants
restaurants = client.restaurants.list(
    city="dar-es-salaam",
    cuisine="tanzanian",
    rating_min=4.0
)

for r in restaurants.data:
    print(f"{r.name} - {r.rating}★")

# Create order
order = client.orders.create(
    restaurant_id="rst_abc123",
    items=[
        {"menu_item_id": "itm_chips_mayai", "quantity": 2},
        {"menu_item_id": "itm_pilau", "quantity": 1},
    ],
    delivery_address={
        "street": "42 Libra Street",
        "area": "Mikocheni",
        "city": "Dar es Salaam",
    },
    payment_method="mpesa",
    phone_number="+255712345678",
)

print(f"Order {order.id} created - Total: {order.total} TZS")`}
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 md:py-28">
        <div className="max-w-[1440px] mx-auto px-5 md:px-8 lg:px-12">
          <SectionTitle
            subtitle="API Reference"
            title="Core Endpoints"
            description="Everything you need to build a full food delivery experience"
          />

          <div className="max-w-4xl mx-auto">
            <div className="border border-gray-100 divide-y divide-gray-100">
              {endpoints.map((endpoint, i) => (
                <motion.div
                  key={endpoint.path}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors duration-150"
                >
                  <span
                    className={`px-2.5 py-0.5 text-xs font-bold uppercase ${methodColors[endpoint.method]}`}
                  >
                    {endpoint.method}
                  </span>
                  <code className="text-sm font-mono text-dark flex-1">
                    {endpoint.path}
                  </code>
                  <span className="text-xs text-gray-400 hidden sm:block">
                    {endpoint.description}
                  </span>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <a
                href="#"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
              >
                View Full API Reference
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-dark py-20 md:py-28">
        <div className="max-w-[1440px] mx-auto px-5 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { value: "50ms", label: "Avg Response Time", icon: Zap },
              { value: "10M+", label: "API Calls / Month", icon: BarChart3 },
              { value: "99.9%", label: "Uptime SLA", icon: Clock },
              { value: "6", label: "Cities Supported", icon: MapPin },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 border border-white/10"
              >
                <stat.icon className="w-6 h-6 text-primary mx-auto mb-3" />
                <div className="text-3xl font-extrabold text-white font-[family-name:var(--font-heading)]">
                  {stat.value}
                </div>
                <div className="text-sm text-white/50 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-[family-name:var(--font-heading)]">
              Ready to build?
            </h2>
            <p className="text-white/60 text-lg mb-8 max-w-xl mx-auto">
              Start with our free tier. No credit card required. Scale when
              you're ready.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg">
                <Code2 className="w-4 h-4" />
                Get Free API Key
              </Button>
              <Link to="/contact">
                <Button
                  variant="secondary"
                  size="lg"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Users className="w-4 h-4" />
                  Talk to Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

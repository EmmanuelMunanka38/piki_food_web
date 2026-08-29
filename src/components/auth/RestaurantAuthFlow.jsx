import { useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  User,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Store,
} from "lucide-react";
import OtpInput from "./OtpInput";
import { useAuthStore } from "../../store/authStore";
import { subscriptionsService } from "../../services/subscriptions";

const VALID_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_PHONE = /^[DR]?\+?\d{7,15}$/;
const OWNER_ROLE = "restaurant_owner";

export default function RestaurantAuthFlow() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const planFromUrl = searchParams.get("plan");
  
  const sendOtp = useAuthStore((s) => s.sendOtp);
  const verifyOTP = useAuthStore((s) => s.verifyOTP);
  const fetchSubscription = useAuthStore((s) => s.fetchSubscription);
  const isLoading = useAuthStore((s) => s.isLoading);

  const [mode, setMode] = useState("login");
  const isSignup = mode === "signup";
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [code, setCode] = useState("");
  const [resendIn, setResendIn] = useState(0);
  const resendTimer = useRef(null);
  
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentPhone, setPaymentPhone] = useState("");

  const { data: plans = [], isLoading: loadingPlans } = useQuery({
    queryKey: ["subscription-plans"],
    queryFn: () => subscriptionsService.listPlans(),
    enabled: isSignup && !!planFromUrl,
  });

  if (plans.length > 0 && !selectedPlan) {
    const plan = plans.find(p => p.id === planFromUrl || p.ClickpesaPriceId === planFromUrl);
    if (plan) {
      setSelectedPlan(plan);
    }
  }

  const startResendTimer = () => {
    setResendIn(60);
    resendTimer.current = setInterval(() => {
      setResendIn((s) => {
        if (s <= 1) {
          clearInterval(resendTimer.current);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    if (isSignup && !formData.name.trim()) {
      setError("Please enter the owner's full name.");
      return;
    }
    if (!VALID_EMAIL.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    const phone = formData.phone.replace(/\s/g, "");
    if (!VALID_PHONE.test(phone)) {
      setError("Please enter a valid phone number (e.g. +255712345678).");
      return;
    }
    try {
      await sendOtp(formData.email, phone, OWNER_ROLE);
      setStep(2);
      setCode("");
      startResendTimer();
    } catch (err) {
      setError(err?.message || "Failed to send code. Please try again.");
    }
  };

  const handleResend = async () => {
    if (resendIn > 0) return;
    setError("");
    try {
      await sendOtp(formData.email, formData.phone.replace(/\s/g, ""), OWNER_ROLE);
      startResendTimer();
    } catch (err) {
      setError(err?.message || "Failed to resend code.");
    }
  };

  const handleVerify = async (e) => {
    if (e) e.preventDefault();
    if (code.length !== 4) return;
    setError("");
    try {
      await verifyOTP(
        formData.email,
        code,
        isSignup ? formData.name.trim() : undefined,
        OWNER_ROLE
      );
      
      // For new signups, automatically start a free trial
      if (isSignup) {
        try {
          await subscriptionsService.startTrial();
        } catch (err) {
          console.error('Failed to start trial:', err);
        }
      }
      
      await fetchSubscription();
      navigate("/restaurant", { replace: true });
    } catch (err) {
      setError(err?.message || "Invalid code. Please try again.");
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!VALID_PHONE.test(paymentPhone.replace(/\s/g, ""))) {
      setError("Please enter a valid payment phone number.");
      return;
    }

    try {
      if (selectedPlan.isTrialPlan) {
        await subscriptionsService.startTrial();
      } else {
        await subscriptionsService.subscribe(selectedPlan.id, paymentPhone.replace(/\s/g, ""));
      }
      
      await fetchSubscription();
      navigate("/restaurant", { replace: true });
    } catch (err) {
      setError(err?.message || "Failed to activate subscription. Please try again.");
    }
  };

  const maskEmail = (email) => {
    const [local, domain] = email.split("@");
    if (!domain) return email;
    return `${local.slice(0, 2)}***@${domain}`;
  };

  const inputClass =
    "w-full pl-11 pr-4 py-3 border border-gray-200 focus:border-primary focus:outline-none transition-colors duration-200 text-sm bg-white";

  return (
    <div className="w-full max-w-md">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-light mb-5">
        <Store className="w-4 h-4 text-primary" />
        <span className="text-xs font-semibold text-primary uppercase tracking-wider">
          Restaurant Owner
        </span>
      </div>

      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-dark mb-2 font-[family-name:var(--font-heading)]">
            {isSignup ? "Register your restaurant" : "Restaurant owner login"}
          </h2>
          <p className="text-gray-500 mb-8">
            {isSignup
              ? "Create an owner account to manage your restaurant on Piki Food"
              : "Enter your details to access your restaurant dashboard"}
          </p>

          <form onSubmit={handleSendOtp} className="space-y-4">
            {isSignup && (
              <div>
                <label className="block text-sm font-medium text-dark mb-1.5">Owner Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. John Mwangi"
                    className={inputClass}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-dark mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="owner@restaurant.com"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-1.5">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+255 712 345 678"
                  className={inputClass}
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-primary text-white font-semibold hover:bg-primary-dark transition-colors duration-200 cursor-pointer font-[family-name:var(--font-heading)] disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Sending code...
                </>
              ) : (
                <>
                  {isSignup ? "Create Owner Account" : "Continue"} <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            {isSignup ? "Already have an owner account? " : "New restaurant owner? "}
            <button
              type="button"
              onClick={() => {
                setMode(isSignup ? "login" : "signup");
                setStep(1);
                setError("");
              }}
              className="font-semibold text-primary hover:text-primary-dark transition-colors cursor-pointer"
            >
              {isSignup ? "Log in" : "Register your restaurant"}
            </button>
          </p>

          <p className="mt-4 text-center text-xs text-gray-400">
            Not a restaurant owner?{" "}
            <a
              href="/login"
              className="text-primary hover:text-primary-dark transition-colors"
            >
              Customer login
            </a>
          </p>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <button
            onClick={() => setStep(1)}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-dark transition-colors mb-6 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <h2 className="text-3xl font-bold text-dark mb-2 font-[family-name:var(--font-heading)]">
            Verify it's you
          </h2>
          <p className="text-gray-500 mb-8">
            We sent a 4-digit code to{" "}
            <span className="font-semibold text-dark">{maskEmail(formData.email)}</span>
          </p>

          <form onSubmit={handleVerify}>
            <OtpInput
              length={4}
              value={code}
              onChange={setCode}
              onComplete={(val) => setCode(val)}
            />

            {error && (
              <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading || code.length !== 4}
              className="mt-6 w-full py-3 bg-primary text-white font-semibold hover:bg-primary-dark transition-colors duration-200 cursor-pointer font-[family-name:var(--font-heading)] disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Verifying...
                </>
              ) : (
                <>
                  {isSignup && planFromUrl ? "Continue to Plan Setup" : "Enter Dashboard"} <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            {resendIn > 0 ? (
              <p className="text-sm text-gray-500">
                Resend code in <span className="font-semibold text-primary">{resendIn}s</span>
              </p>
            ) : (
              <button
                onClick={handleResend}
                className="text-sm font-semibold text-primary hover:text-primary-dark transition-colors cursor-pointer flex items-center gap-1.5 mx-auto"
              >
                <CheckCircle2 className="w-4 h-4" /> Resend code
              </button>
            )}
          </div>
        </motion.div>
      )}

      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <button
            onClick={() => setStep(2)}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-dark transition-colors mb-6 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <h2 className="text-3xl font-bold text-dark mb-2 font-[family-name:var(--font-heading)]">
            Activate Your Plan
          </h2>
          <p className="text-gray-500 mb-8">
            {selectedPlan?.isTrialPlan 
              ? "Start your 14-day free trial" 
              : `Complete payment for ${selectedPlan?.name} plan`}
          </p>

          {loadingPlans ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : selectedPlan ? (
            <div className="bg-gray-50 border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-dark">{selectedPlan.name}</h3>
                {selectedPlan.isTrialPlan ? (
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold">
                    FREE TRIAL
                  </span>
                ) : (
                  <span className="text-2xl font-bold text-primary">
                    TSh {selectedPlan.priceCents / 100}/mo
                  </span>
                )}
              </div>
              
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ {selectedPlan.maxMenuItems === 999999 ? "Unlimited" : selectedPlan.maxMenuItems} menu items</li>
                {selectedPlan.hasAnalytics && <li>✓ Analytics dashboard</li>}
                {selectedPlan.hasOnlinePayments && <li>✓ Online payments</li>}
                {selectedPlan.priorityPlacement && <li>✓ Priority placement</li>}
                {selectedPlan.isTrialPlan && <li>✓ 14 days free access</li>}
              </ul>
            </div>
          ) : null}

          <form onSubmit={handlePaymentSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark mb-1.5">
                {selectedPlan?.isTrialPlan ? "Payment Phone (for future billing)" : "Payment Phone Number"}
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={paymentPhone}
                  onChange={(e) => setPaymentPhone(e.target.value)}
                  placeholder="+255 712 345 678"
                  className={inputClass}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {selectedPlan?.isTrialPlan 
                  ? "We'll use this number when your trial ends and you upgrade to a paid plan."
                  : "You'll receive an M-Pesa prompt to complete payment."}
              </p>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading || !paymentPhone.trim()}
              className="w-full py-3 bg-primary text-white font-semibold hover:bg-primary-dark transition-colors duration-200 cursor-pointer font-[family-name:var(--font-heading)] disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Activating...
                </>
              ) : (
                <>
                  {selectedPlan?.isTrialPlan ? "Start Free Trial" : "Complete Payment"} <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </motion.div>
      )}
    </div>
  );
}

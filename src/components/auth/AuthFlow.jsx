import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  User,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import OtpInput from "./OtpInput";
import { useAuthStore } from "../../store/authStore";

const VALID_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_PHONE = /^[DR]?\+?\d{7,15}$/;

function detectRole(phone) {
  const trimmed = phone.trim();
  if (/^D/i.test(trimmed)) return "driver";
  if (/^R/i.test(trimmed)) return "restaurant_owner";
  return "customer";
}

export default function AuthFlow({ mode }) {
  const navigate = useNavigate();
  const isSignup = mode === "signup";
  const sendOtp = useAuthStore((s) => s.sendOtp);
  const verifyOTP = useAuthStore((s) => s.verifyOTP);
  const isLoading = useAuthStore((s) => s.isLoading);

  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [code, setCode] = useState("");
  const [resendIn, setResendIn] = useState(0);
  const resendTimer = useRef(null);

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
      setError("Please enter your full name.");
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
      const role = detectRole(phone);
      await sendOtp(formData.email, phone, role);
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
      await sendOtp(formData.email, formData.phone.replace(/\s/g, ""), detectRole(formData.phone));
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
      const role = detectRole(formData.phone);
      await verifyOTP(
        formData.email,
        code,
        isSignup ? formData.name.trim() : undefined,
        role
      );
      navigate("/app", { replace: true });
    } catch (err) {
      setError(err?.message || "Invalid code. Please try again.");
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
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-dark mb-2 font-[family-name:var(--font-heading)]">
            {isSignup ? "Create your account" : "Log in to your account"}
          </h2>
          <p className="text-gray-500 mb-8">
            {isSignup
              ? "Start ordering your favorite meals in minutes"
              : "We'll send you a 4-digit code to verify it's you"}
          </p>

          <form onSubmit={handleSendOtp} className="space-y-4">
            {isSignup && (
              <div>
                <label className="block text-sm font-medium text-dark mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
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
                  placeholder="john@example.com"
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
                  {isSignup ? "Create Account" : "Continue"} <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            {isSignup ? "Already have an account? " : "Don't have an account? "}
            <Link
              to={isSignup ? "/login" : "/signup"}
              className="font-semibold text-primary hover:text-primary-dark transition-colors"
            >
              {isSignup ? "Log in" : "Sign up for free"}
            </Link>
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
            Enter verification code
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
                  Verify & Continue <ArrowRight className="w-4 h-4" />
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
    </div>
  );
}

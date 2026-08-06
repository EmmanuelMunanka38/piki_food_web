import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { Check } from "lucide-react";

const TOTAL_TIME = 4000;

export default function OrderSuccess({ order }) {
  const navigate = useNavigate();
  const rootRef = useRef(null);
  const cardRef = useRef(null);
  const tickRef = useRef(null);
  const ringRef = useRef(null);
  const titleRef = useRef(null);
  const badgeRef = useRef(null);
  const hintRef = useRef(null);

  const orderNumber = order.orderNumber?.replace("PIKI-", "") || order.id.slice(0, 6);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        cardRef.current,
        { y: 40, scale: 0.92, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, duration: 0.5 }
      )
        .fromTo(
          tickRef.current,
          { scale: 0, rotate: -120, opacity: 0 },
          { scale: 1, rotate: 0, opacity: 1, duration: 0.7, ease: "elastic.out(1, 0.5)" },
          "-=0.25"
        )
        .fromTo(
          ringRef.current,
          { scale: 0.6, opacity: 0.9 },
          { scale: 2.2, opacity: 0, duration: 1.1, ease: "power2.out" },
          "-=0.35"
        )
        .fromTo(
          titleRef.current,
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.45 },
          "-=0.6"
        )
        .fromTo(
          badgeRef.current,
          { scale: 0.7, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(2)" },
          "-=0.2"
        )
        .fromTo(
          hintRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.4 },
          "-=0.15"
        );
    }, rootRef);

    const timer = setTimeout(() => {
      navigate(`/app/track/${order.id}`, { replace: true });
    }, TOTAL_TIME);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, [order.id, navigate]);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm flex items-center justify-center p-6"
    >
      <div ref={cardRef} className="relative z-10 bg-white w-full max-w-sm shadow-2xl p-8 text-center">
        <div className="relative w-20 h-20 mx-auto">
          <span ref={ringRef} className="absolute inset-0 border-4 border-primary rounded-full pointer-events-none" />
          <div
            ref={tickRef}
            className="absolute inset-0 bg-primary flex items-center justify-center rounded-full shadow-xl shadow-primary/30"
          >
            <Check className="w-10 h-10 text-white" strokeWidth={3} />
          </div>
        </div>

        <h2
          ref={titleRef}
          className="mt-6 text-2xl font-bold text-dark font-[family-name:var(--font-heading)]"
        >
          Thank you for your order!
        </h2>
        <p className="text-sm text-gray-500 mt-2">Your delicious food is being prepared.</p>

        <div
          ref={badgeRef}
          className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-primary-light text-primary font-semibold text-sm"
        >
          <Check className="w-4 h-4" />
          Order #{orderNumber}
        </div>

        <p ref={hintRef} className="mt-8 text-xs text-gray-400">
          Taking you to order tracking...
        </p>
      </div>
    </div>
  );
}

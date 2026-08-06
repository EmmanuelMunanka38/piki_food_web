import { Check } from "lucide-react";
import { ORDER_STEPS, getStepIndex } from "../../lib/orderStatus";

export default function StatusTimeline({ status }) {
  const activeIndex = getStepIndex(status);
  const cancelled = status === "cancelled";

  return (
    <ol className="relative">
      {ORDER_STEPS.map((step, i) => {
        const done = i < activeIndex;
        const current = i === activeIndex;
        return (
          <li key={step.key} className="relative flex gap-3 pb-6 last:pb-0">
            {i < ORDER_STEPS.length - 1 && (
              <span
                className={`absolute left-[13px] top-7 bottom-0 w-0.5 ${
                  done || current ? "bg-primary" : "bg-gray-200"
                }`}
              />
            )}
            <span
              className={`relative z-10 mt-0.5 w-7 h-7 flex items-center justify-center shrink-0 ${
                done
                  ? "bg-primary"
                  : current
                  ? "bg-primary-light border-2 border-primary"
                  : "bg-gray-100 border border-gray-200"
              }`}
            >
              {done ? (
                <Check className="w-4 h-4 text-white" />
              ) : (
                <span
                  className={`w-2 h-2 ${current ? "bg-primary animate-pulse" : "bg-gray-300"}`}
                />
              )}
            </span>
            <div className="pt-1">
              <p
                className={`text-sm font-semibold ${
                  done || current ? "text-dark" : "text-gray-400"
                }`}
              >
                {step.label}
              </p>
              {current && !cancelled && (
                <p className="text-xs text-primary mt-0.5">In progress...</p>
              )}
            </div>
          </li>
        );
      })}
      {cancelled && (
        <li className="mt-4 px-4 py-3 bg-red-50 border border-red-100 text-red-600 text-sm font-semibold">
          This order was cancelled.
        </li>
      )}
    </ol>
  );
}

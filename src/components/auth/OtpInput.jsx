import { useRef, useState } from "react";

export default function OtpInput({ length = 4, value, onChange, onComplete }) {
  const inputs = useRef([]);
  const [values, setValues] = useState(value ? value.split("") : Array(length).fill(""));

  const handleChange = (index, e) => {
    const digit = e.target.value.replace(/\D/g, "").slice(-1);
    const next = [...values];
    next[index] = digit;
    setValues(next);
    onChange?.(next.join(""));
    if (digit && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }
    const joined = next.join("");
    if (joined.length === length) onComplete?.(joined);
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !values[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (text.length === length) {
      e.preventDefault();
      const next = text.split("");
      setValues(next);
      onChange?.(text);
      onComplete?.(text);
      inputs.current[length - 1]?.focus();
    }
  };

  return (
    <div className="flex items-center justify-center gap-3" onPaste={handlePaste}>
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (inputs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={values[i] || ""}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className="w-14 h-16 text-center text-2xl font-bold text-dark border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors duration-200 bg-white"
        />
      ))}
    </div>
  );
}

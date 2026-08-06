import { useState } from "react";
import { UtensilsCrossed } from "lucide-react";

export default function FoodImage({ src, alt, className = "" }) {
  const [error, setError] = useState(false);
  if (!src || error) {
    return (
      <div
        className={`flex items-center justify-center bg-primary-light ${className}`}
        aria-label={alt}
      >
        <UtensilsCrossed className="w-1/4 h-1/4 text-primary/40" />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setError(true)}
      className={className}
    />
  );
}

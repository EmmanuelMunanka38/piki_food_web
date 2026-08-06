import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Clock, MapPin, Bike } from "lucide-react";
import FoodImage from "./FoodImage";

export default function RestaurantCard({ restaurant, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: Math.min(index, 6) * 0.05 }}
      whileHover={{ y: -6 }}
      className="group"
    >
      <Link
        to={`/app/restaurant/${restaurant.id}`}
        className="block bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
      >
        <div className="relative aspect-[16/9] overflow-hidden">
          <FoodImage
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <span className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold bg-white/90 backdrop-blur-sm text-primary">
            {restaurant.cuisine}
          </span>
          {!restaurant.isOpen && (
            <span className="absolute top-3 right-3 px-3 py-1 text-xs font-semibold bg-red-500/90 text-white">
              Closed
            </span>
          )}
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between mb-2 gap-3">
            <h3 className="text-lg font-bold text-dark group-hover:text-primary transition-colors duration-300 font-[family-name:var(--font-heading)]">
              {restaurant.name}
            </h3>
            <span className="flex items-center gap-1 shrink-0 px-2 py-0.5 bg-green-50 text-green-700 text-xs font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              {Number(restaurant.rating).toFixed(1)}
            </span>
          </div>

          <p className="text-sm text-gray-500 mb-4 line-clamp-1">{restaurant.address}</p>

          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-primary" />
              {restaurant.deliveryTime}
            </span>
            <span className="flex items-center gap-1">
              <Bike className="w-3.5 h-3.5 text-primary" />
              {restaurant.deliveryFee === 0
                ? "Free"
                : `TSh ${Number(restaurant.deliveryFee).toLocaleString()}`}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              {restaurant.distance}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

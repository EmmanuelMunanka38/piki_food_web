import { motion } from "framer-motion";
import { Star, ShoppingCart } from "lucide-react";

export default function DishCard({ item, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100"
    >
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={item.image}
          alt={item.dish_name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <span className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold bg-white/90 backdrop-blur-sm rounded-full text-primary">
          {item.category}
        </span>
        {item.is_vegetarian && (
          <span className="absolute top-3 right-3 px-3 py-1 text-xs font-semibold bg-green-500/90 backdrop-blur-sm rounded-full text-white">
            Veg
          </span>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-dark group-hover:text-primary transition-colors duration-300">
            {item.dish_name}
          </h3>
          <div className="flex items-center gap-1 shrink-0">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-semibold text-dark">{item.rating}</span>
          </div>
        </div>

        <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
          {item.description}
        </p>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 block">{item.restaurant}</span>
            <span className="text-xl font-bold text-primary">
              {item.price_tzs.toLocaleString()} <span className="text-sm font-normal text-gray-400">TZS</span>
            </span>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-11 h-11 flex items-center justify-center bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors duration-300 shadow-lg shadow-primary/25 cursor-pointer"
          >
            <ShoppingCart className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

import { useCartStore } from "../../store/cartStore";
import { formatTZS } from "../../lib/format";
import FoodImage from "./FoodImage";

export default function MenuItemCard({ item, showRestaurant = false }) {
  const addItem = useCartStore((s) => s.addItem);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(item, 1);
  };

  return (
    <div className="group bg-white overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden">
        <FoodImage
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {item.isPopular && (
          <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-semibold bg-amber-400 text-white uppercase tracking-wide">
            Popular
          </span>
        )}
        {!item.isAvailable && (
          <span className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="px-3 py-1 text-xs font-semibold bg-white text-red-500">
              Unavailable
            </span>
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h4 className="text-base font-bold text-dark font-[family-name:var(--font-heading)] line-clamp-1">
          {item.name}
        </h4>
        {showRestaurant && item.restaurant && (
          <p className="text-xs text-gray-400 mb-1 truncate">{item.restaurant.name}</p>
        )}
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-4">
          {item.description}
        </p>

        <div className="mt-auto flex items-center justify-between">
          <span className="text-lg font-bold text-primary">
            {formatTZS(item.price)}
          </span>
          <button
            onClick={handleAdd}
            disabled={!item.isAvailable}
            className="px-4 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary-dark transition-colors duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            + Add
          </button>
        </div>
      </div>
    </div>
  );
}

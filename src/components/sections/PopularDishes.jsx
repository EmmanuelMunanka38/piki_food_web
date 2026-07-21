import { motion } from "framer-motion";
import SectionTitle from "../ui/SectionTitle";
import DishCard from "../ui/DishCard";
import Button from "../ui/Button";
import { menuItems } from "../../data/menuItems";

export default function PopularDishes() {
  const popularItems = menuItems.slice(0, 6);

  return (
    <section id="menu" className="py-20 md:py-28" style={{ backgroundColor: "#F8FAFC" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          subtitle="Our Menu"
          title="Popular Dishes"
          description="Explore our most ordered dishes from the best restaurants"
        />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {popularItems.map((item, index) => (
            <DishCard key={item.id} item={item} index={index} />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex justify-center mt-12 md:mt-16"
        >
          <Button variant="secondary" href="#menu">
            View Full Menu
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

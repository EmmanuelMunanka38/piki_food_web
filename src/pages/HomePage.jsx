import Hero from "../components/sections/Hero";
import FoodCompanies from "../components/sections/FoodCompanies";
import About from "../components/sections/About";
import PlatformShowcase from "../components/sections/PlatformShowcase";
import Testimonials from "../components/sections/Testimonials";
import MapSection from "../components/sections/MapSection";

export default function HomePage() {
  return (
    <>
      <Hero />

      <FoodCompanies />

      <About /> 

      <PlatformShowcase />

      <MapSection />

      <Testimonials />
    </>
  );
}

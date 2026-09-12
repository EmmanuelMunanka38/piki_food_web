import Hero from "../components/sections/Hero";
import ValueProps from "../components/sections/ValueProps";
import About from "../components/sections/About";
import Testimonials from "../components/sections/Testimonials";
import MapSection from "../components/sections/MapSection";

export default function HomePage() {
  return (
    <>
      <Hero />

      <About />

      <ValueProps />

      <MapSection />

      <Testimonials />
    </>
  );
}

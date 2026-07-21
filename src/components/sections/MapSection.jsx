import { useState } from "react";
import Map, { Marker, Popup } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPin } from "lucide-react";
import { motion } from "framer-motion";
import SectionTitle from "../ui/SectionTitle";
import { MAPBOX_TOKEN, SERVICE_CITIES } from "../../data/mapConfig";

export default function MapSection() {
  const [selectedCity, setSelectedCity] = useState(null);

  return (
    <section className="py-16 md:py-24 bg-off-white">
      <div className="mx-auto max-w-[1440px] px-5 md:px-8 lg:px-12">
        <SectionTitle
          subtitle="Our Coverage"
          title="We're Where You Are"
          description="Currently serving food delivery in these cities across Tanzania and Kenya"
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden bg-white border border-gray-100 shadow-sm"
          style={{ height: "500px" }}
        >
          <Map
            initialViewState={{
              longitude: 37.5,
              latitude: -3.5,
              zoom: 5.2,
            }}
            style={{ width: "100%", height: "100%" }}
            mapStyle="mapbox://styles/mapbox/light-v11"
            mapboxAccessToken={MAPBOX_TOKEN}
            attributionControl={false}
          >
            {SERVICE_CITIES.map((city) => (
              <Marker
                key={city.name}
                longitude={city.coordinates[0]}
                latitude={city.coordinates[1]}
                anchor="bottom"
                onClick={() => setSelectedCity(city)}
              >
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className="cursor-pointer"
                >
                  <div className="relative flex flex-col items-center">
                    <div className="w-10 h-10 bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-primary" />
                  </div>
                </motion.div>
              </Marker>
            ))}

            {selectedCity && (
              <Popup
                longitude={selectedCity.coordinates[0]}
                latitude={selectedCity.coordinates[1]}
                anchor="bottom"
                offset={50}
                onClose={() => setSelectedCity(null)}
                closeButton={false}
                className="city-popup"
              >
                <div className="p-1 text-center">
                  <p className="font-bold text-dark text-sm font-[family-name:var(--font-heading)]">
                    {selectedCity.name}
                  </p>
                  <p className="text-xs text-gray-500">{selectedCity.country}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold bg-primary-light text-primary">
                    Active
                  </span>
                </div>
              </Popup>
            )}
          </Map>

          <div className="absolute bottom-4 left-4 z-10 bg-white/90 backdrop-blur-sm p-3 shadow-sm border border-gray-100">
            <p className="text-xs font-semibold text-dark mb-2 font-[family-name:var(--font-heading)]">
              Active Cities
            </p>
            <div className="flex flex-wrap gap-1.5">
              {SERVICE_CITIES.map((city) => (
                <button
                  key={city.name}
                  onClick={() => setSelectedCity(city)}
                  className="px-2 py-1 text-[11px] font-medium bg-primary-light text-primary hover:bg-primary hover:text-white transition-colors duration-200 cursor-pointer"
                >
                  {city.name}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

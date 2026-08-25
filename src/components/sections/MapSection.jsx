import { useState } from "react";
import Map, { Marker, Popup } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPin, Clock, Store } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MAPBOX_TOKEN, SERVICE_CITIES } from "../../data/mapConfig";

const tanzaniaCities = SERVICE_CITIES.filter((c) => c.country === "Tanzania");

const allTanzaniaRegions = [
  "Arusha",
  "Dar es Salaam",
  "Dodoma",
  "Geita",
  "Iringa",
  "Kagera",
  "Katavi",
  "Kigoma",
  "Kilimanjaro",
  "Lindi",
  "Manyara",
  "Mara",
  "Mbeya",
  "Morogoro",
  "Mtwara",
  "Mwanza",
  "Njombe",
  "Pemba North",
  "Pemba South",
  "Pwani",
  "Rukwa",
  "Ruvuma",
  "Shinyanga",
  "Simiyu",
  "Singida",
  "Songwe",
  "Tabora",
  "Tanga",
  "Zanzibar Central",
  "Zanzibar North",
  "Zanzibar Urban",
];

const unservedRegions = allTanzaniaRegions.filter(
  (name) => !tanzaniaCities.some((c) => c.name === name)
);

const cityStats = {
  "Dar es Salaam": { restaurants: 240, avgTime: "25 min" },
  "Mwanza": { restaurants: 85, avgTime: "30 min" },
  "Mbeya": { restaurants: 45, avgTime: "35 min" },
  "Nairobi": { restaurants: 310, avgTime: "22 min" },
  "Mombasa": { restaurants: 120, avgTime: "28 min" },
  "Kisumu": { restaurants: 55, avgTime: "32 min" },
};

export default function MapSection() {
  const [selectedCity, setSelectedCity] = useState(null);

  return (
    <section className="py-16 md:py-24 bg-white border-t border-gray-100">
      <div className="mx-auto max-w-[1440px] px-5 md:px-8 lg:px-12">
        <div className="mb-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-dark font-[family-name:var(--font-heading)] tracking-tight">
            Where We Are Found
          </h2>
          <p className="mt-4 text-sm md:text-base text-gray-500 max-w-xl mx-auto">
            Discover the cities and regions we currently serve, with more being added every month.
          </p>
          <div className="w-16 h-1 bg-primary mx-auto mt-3" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden bg-white border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300"
          style={{ height: "520px" }}
        >
          <Map
            initialViewState={{
              longitude: 37.5,
              latitude: -3.5,
              zoom: 5.2,
            }}
            style={{ width: "100%", height: "100%" }}
            mapStyle="mapbox://styles/mapbox/streets-v12"
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
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  className="cursor-pointer group"
                >
                  <div className="relative flex flex-col items-center">
                    <div className="w-10 h-10 bg-primary flex items-center justify-center shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-shadow duration-300">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-primary" />
                    <span className="mt-1 px-2 py-0.5 bg-white/90 backdrop-blur-sm text-[10px] font-semibold text-dark shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                      {city.name}
                    </span>
                  </div>
                </motion.div>
              </Marker>
            ))}

            <AnimatePresence>
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
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="p-3 text-center min-w-[160px]"
                  >
                    <p className="font-bold text-dark text-sm font-[family-name:var(--font-heading)]">
                      {selectedCity.name}
                    </p>
                    <p className="text-xs text-gray-400 mb-2">{selectedCity.country}</p>
                    <div className="flex items-center justify-center gap-3 text-[11px] text-gray-500 mb-2">
                      <span className="flex items-center gap-1">
                        <Store className="w-3 h-3" />
                        {cityStats[selectedCity.name]?.restaurants ?? "—"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {cityStats[selectedCity.name]?.avgTime ?? "—"}
                      </span>
                    </div>
                    <span className="inline-block px-3 py-1 text-[10px] font-semibold bg-green-50 text-green-700 border border-green-200">
                      Accepting Orders
                    </span>
                  </motion.div>
                </Popup>
              )}
            </AnimatePresence>
          </Map>

          <div className="absolute bottom-4 left-4 z-10 bg-white/95 backdrop-blur-md p-4 shadow-md border border-gray-100 min-w-[180px]">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              <p className="text-xs font-bold text-dark font-[family-name:var(--font-heading)] uppercase tracking-wider">
                Active Cities
              </p>
            </div>
            <div className="space-y-2.5">
              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                  Tanzania
                </p>
                <div className="flex flex-wrap gap-1">
                  {tanzaniaCities.map((city) => (
                    <button
                      key={city.name}
                      onClick={() => setSelectedCity(city)}
                      className={`px-2.5 py-1 text-[11px] font-medium transition-all duration-200 cursor-pointer ${
                        selectedCity?.name === city.name
                          ? "bg-primary text-white shadow-sm"
                          : "bg-gray-50 text-gray-600 hover:bg-primary-light hover:text-primary border border-gray-200"
                      }`}
                    >
                      {city.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-4 right-4 z-10 bg-white/95 backdrop-blur-md px-3 py-2 shadow-md border border-gray-100">
            <div className="flex items-center gap-2 text-[11px] text-gray-500">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span>All cities active</span>
            </div>
          </div>
        </motion.div>

        <div className="mt-12 md:mt-16">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold tracking-wide uppercase text-primary">
              Our Target
            </span>
            <h3 className="text-2xl md:text-3xl font-bold text-dark leading-tight font-[family-name:var(--font-heading)] mb-4">
              Every region of Tanzania, within reach
            </h3>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed">
              Our goal is to bring Piki Food to all 31 regions of Tanzania — from the
              busy streets of Dar es Salaam to the shores of Zanzibar and the highlands
              of Mbeya. We're expanding fast so no kitchen is too far and no customer is
              left without the food they love.
            </p>
          </div>

          <div className="mt-8">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Regions we haven't reached yet
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {unservedRegions.map((region) => (
                <span
                  key={region}
                  className="px-3 py-2 text-[11px] font-medium text-gray-500 bg-gray-50 border border-gray-200"
                >
                  {region}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

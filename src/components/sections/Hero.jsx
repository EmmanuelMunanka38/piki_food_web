import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, ChevronDown, Search, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { MAPBOX_TOKEN, SERVICE_CITIES, isCitySupported } from "../../data/mapConfig";
import { Link } from "react-router-dom";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Hero() {
  const [address, setAddress] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("Deliver now");
  const [suggestions, setSuggestions] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const fetchSuggestions = useCallback(async (query) => {
    if (query.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&country=TZ,KE&proximity=37.5,-3.5&limit=5`
      );
      const data = await res.json();
      if (data.features) {
        setSuggestions(data.features);
        setShowSuggestions(true);
      }
    } catch {
      setSuggestions([]);
    }
  }, []);

  const handleAddressChange = (e) => {
    const value = e.target.value;
    setAddress(value);
    setSearchResult(null);
    fetchSuggestions(value);
  };

  const handleSuggestionClick = (feature) => {
    setAddress(feature.place_name);
    setShowSuggestions(false);
    setSuggestions([]);
    checkLocation(feature.place_name);
  };

  const checkLocation = (placeName) => {
    const supported = isCitySupported(placeName);
    if (supported) {
      const city = SERVICE_CITIES.find(
        (c) =>
          placeName.toLowerCase().includes(c.name.toLowerCase()) ||
          placeName.toLowerCase().includes(c.country.toLowerCase())
      );
      setSearchResult({
        supported: true,
        city: city?.name || placeName,
      });
    } else {
      setSearchResult({ supported: false });
    }
  };

  const handleSearch = () => {
    if (!address.trim()) return;
    setSearching(true);
    setShowSuggestions(false);

    setTimeout(() => {
      checkLocation(address);
      setSearching(false);
    }, 800);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-end pb-16 md:items-center md:pb-0 overflow-hidden"
    >
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1920&h=1080&fit=crop"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-5 md:px-8 lg:px-12 pt-24 md:pt-0">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 md:gap-12">
          <motion.div
            className="flex-1 max-w-xl"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h1
              variants={itemVariants}
              className="text-[40px] leading-[1.1] font-extrabold text-dark sm:text-5xl lg:text-[64px] mb-6"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Food delivery
              <br />
              near you
            </motion.h1>

            <motion.div
              variants={itemVariants}
              className="relative flex flex-col sm:flex-row items-stretch gap-0 bg-white shadow-lg shadow-black/8 p-1.5 mb-4"
            >
              <div className="flex items-center gap-3 flex-1 px-4 py-3 border-b sm:border-b-0 sm:border-r border-gray-200 relative">
                <MapPin className="w-5 h-5 text-dark shrink-0" />
                <input
                  type="text"
                  value={address}
                  onChange={handleAddressChange}
                  onKeyDown={handleKeyDown}
                  onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder="Enter delivery address"
                  className="w-full text-sm text-dark placeholder-gray-400 outline-none bg-transparent"
                />

                <AnimatePresence>
                  {showSuggestions && suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 shadow-lg z-50 max-h-60 overflow-y-auto"
                    >
                      {suggestions.map((feature) => (
                        <button
                          key={feature.id}
                          onMouseDown={() => handleSuggestionClick(feature)}
                          className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                        >
                          <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-sm text-dark">{feature.place_name}</p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {isCitySupported(feature.place_name)
                                ? "Available now"
                                : "Coming soon"}
                            </p>
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center gap-2 px-4 py-3 border-b sm:border-b-0 sm:border-r border-gray-200 sm:max-w-[180px]">
                <Clock className="w-5 h-5 text-dark shrink-0" />
                <select
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  className="flex-1 text-sm text-dark bg-transparent outline-none cursor-pointer appearance-none"
                >
                  <option value="Deliver now">Deliver now</option>
                  <option value="Schedule">Schedule for later</option>
                </select>
                <ChevronDown className="w-4 h-4 text-dark/50 shrink-0" />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSearch}
                disabled={searching}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-dark text-white text-sm font-semibold hover:bg-dark/90 transition-colors duration-200 cursor-pointer mt-1 sm:mt-0 disabled:opacity-60"
              >
                {searching ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                Search here
              </motion.button>
            </motion.div>

            <AnimatePresence mode="wait">
              {searchResult && (
                <motion.div
                  key={searchResult.supported ? "supported" : "unsupported"}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium mb-4 ${
                    searchResult.supported
                      ? "bg-primary-light text-primary"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {searchResult.supported ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>
                        Great! We deliver to <strong>{searchResult.city}</strong>
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 shrink-0" />
                      <span>
                        <strong>Coming soon</strong> to this area. We're expanding fast!
                      </span>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.p
              variants={itemVariants}
              className="text-sm text-dark/60"
            >
              Or{" "}
              <Link
                to="/contact"
                className="font-semibold text-dark underline underline-offset-2 hover:text-primary transition-colors"
              >
                Sign In
              </Link>
            </motion.p>
          </motion.div>

          <motion.div
            className="hidden md:flex flex-1 justify-end items-center"
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          >
            <img
              src="/app-screenshot.png"
              alt="Piki Food App"
              className="w-full max-w-[400px] h-auto drop-shadow-2xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

export const SERVICE_CITIES = [
  {
    name: "Dar es Salaam",
    country: "Tanzania",
    coordinates: [39.2083, -6.7924],
  },
  {
    name: "Mwanza",
    country: "Tanzania",
    coordinates: [32.9175, -2.5164],
  },
  {
    name: "Mbeya",
    country: "Tanzania",
    coordinates: [33.4513, -8.9015],
  },
  {
    name: "Nairobi",
    country: "Kenya",
    coordinates: [36.8219, -1.2921],
  },
  {
    name: "Mombasa",
    country: "Kenya",
    coordinates: [39.6682, -4.0435],
  },
  {
    name: "Kisumu",
    country: "Kenya",
    coordinates: [34.7617, -0.1022],
  },
];

export function isCitySupported(placeName) {
  const lower = placeName.toLowerCase();
  return SERVICE_CITIES.some(
    (city) =>
      lower.includes(city.name.toLowerCase()) ||
      lower.includes(city.country.toLowerCase())
  );
}

export function getSupportedCity(placeName) {
  const lower = placeName.toLowerCase();
  return SERVICE_CITIES.find(
    (city) =>
      lower.includes(city.name.toLowerCase()) ||
      lower.includes(city.country.toLowerCase())
  );
}

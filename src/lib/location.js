import { MAPBOX_TOKEN } from "../data/mapConfig";

export function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject(new Error("Geolocation is not supported by this browser."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }),
      () =>
        reject(
          new Error("Could not access your location. Please allow location access and try again.")
        ),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
}

export async function reverseGeocode(lng, lat) {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Could not determine your location.");
  const json = await res.json();
  const features = json.features || [];

  const address = features.find((f) => f.place_type.includes("address"));
  const neighborhood = features.find((f) => f.place_type.includes("neighborhood"));
  const locality = features.find((f) => f.place_type.includes("locality"));
  const place = features.find((f) => f.place_type.includes("place"));

  const streetParts = [];
  if (address?.address) streetParts.push(address.address);
  if (address?.text) streetParts.push(address.text);
  const street = streetParts.join(" ");

  const area = neighborhood?.text || locality?.text || "";
  const city = place?.text || locality?.text || "";

  return { street, area, city };
}

export async function detectAddress() {
  const { latitude, longitude } = await getCurrentPosition();
  const address = await reverseGeocode(longitude, latitude);
  return { ...address, label: "My Location" };
}

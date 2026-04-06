import * as Location from "expo-location";

//* Locaton Helper Function

export async function requestLocationPermission() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    console.log("Location permission denied");
    return;
  }
  // ✅ permission granted, get location
  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

  const [address] = await Location.reverseGeocodeAsync({
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  });
  let city = address.city ?? "Unknown City";
  let country = address.country ?? "Unknown Country";
  let compiledAddress = city + ", " + country;
  let addressInstance = {
    street: address.street ?? "",
    city,
    country,
    compactAddress: compiledAddress,
  };

  // Location Instance
  return addressInstance;
}

export const optimizeCloudinaryUrl = (url: string, width = 400, height=300) => {
  return url.replace("/upload/", `/upload/w_${width},h_${height},c_fill,q_auto,f_auto/`);
};

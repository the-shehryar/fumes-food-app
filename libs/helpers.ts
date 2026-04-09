import * as Location from "expo-location";
import { DATABASE_ID, databases } from "./appwrite";
import { Query } from "react-native-appwrite";
import usePreferencesStore from "@/stores/preferences.store";
import { AddressAppwrite } from "@/types/type";
import { ToastAndroid } from "react-native";

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

export const optimizeCloudinaryUrl = (
  url: string,
  width = 400,
  height = 300,
) => {
  return url.replace(
    "/upload/",
    `/upload/w_${width},h_${height},c_fill,q_auto,f_auto/`,
  );
};

export async function fetchUserAddress(targetUser: string) {
  try {
    let savedAddresses = await databases.listRows({
      databaseId: DATABASE_ID,
      tableId: "addresses",
      queries: [
        Query.equal("userId", targetUser),
        Query.orderDesc("$createdAt"),
      ],
    });
    return savedAddresses.rows;
  } catch (error) {
    if (error instanceof Error)
      ToastAndroid.show(error.message, ToastAndroid.LONG);
  }
}

import LocationIcon from "@/assets/images/majesticons_map-marker.svg";
import seed from "@/libs/seed";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomSearchInput from "../components/CustomIconInput";

export default function SearchScreen() {
  return (
    <SafeAreaView>
      <TouchableOpacity
        style={styles.seedBtn}
        onPress={() => seed().catch((error) => console.log(error))}
      >
        <Text>Seed Data</Text>
      </TouchableOpacity>
      <View style={styles.locationWrapper}>
        <Text style={styles.locationHeaderText}>Delivery to</Text>
        <Pressable style={styles.locationPressable}>
          <View style={styles.locationIcon}>
            <LocationIcon width={24} height={24} />
          </View>
          <TouchableOpacity style={styles.locationPressable}>
            <Text style={styles.locationText}>Rawalpindi, Pakistan</Text>
            
          </TouchableOpacity>
        </Pressable>
      </View>
      <CustomSearchInput
        icon
        label="Search"
        placeholder="Want something cheezzy??"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  seedBtn: {
    // display: "none",
    justifyContent: "center",
    alignItems: "center",
    width: 220,
    height: 50,
    backgroundColor: "#6bfa72ed",
  },
  locationWrapper: {
    width: "100%",
    height: 100,
    justifyContent  :"center",
    alignItems  : 'flex-start',
    paddingHorizontal: 10,
  },
  locationHeaderText: {
    fontSize: 12,
    fontWeight: 600,
    color: "#050505e1",
  },
  locationPressable: {
    width: 'auto',
    height: 40,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  locationText: {
    fontSize : 16,
    paddingHorizontal : 4
  },
  locationIcon: {
    width: 24,
    height: 32,
    justifyContent: "center",
    alignItems: "flex-start",
  },
});

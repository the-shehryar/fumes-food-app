import LocationIcon from "@/assets/images/majesticons_map-marker.svg";
import { getCategories, getMenu } from "@/libs/appwrite";
import seed from "@/libs/seed";
import useAppwrite from "@/libs/useAppwrite";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { useEffect } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomSearchInput from "../components/CustomIconInput";

export default function SearchScreen() {
  let { category, query } = useLocalSearchParams<{
    category: string;
    query?: string;
  }>();
  let { data, refetch, loading, error } = useAppwrite({
    fn: getMenu,
    params: {
      category: category ? category : "",
      query: query ? query : "",
      limit: 10,
    },
    skip: false,
  });
  console.log(`menu from search screen ${data}`);

  let { data: categories } = useAppwrite({
    fn: getCategories,
    skip: false,
  });

  useEffect(() => {
    if (category !== undefined && query !== undefined) {
      refetch({ category, query, limit: 10 }).catch((error) =>
        console.log(error),
      );
    }
  }, [category, query]);

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

      {/* Categories Flatlist */}

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.$id}
        style={styles.mainFlatListWrapper}
        data={categories}
        renderItem={({ item }) => (
          <View style={styles.categoriesBtn}>
            <Text>{item.name}</Text>
          </View>
        )}
      />

     
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 20,
  },
  seedBtn: {
    display: "none",
    justifyContent: "center",
    alignItems: "center",
    width: 220,
    height: 50,
    backgroundColor: "#6bfa72ed",
  },
  locationWrapper: {
    width: "100%",
    height: 100,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingHorizontal: 10,
  },
  locationHeaderText: {
    fontSize: 12,
    fontWeight: 600,
    color: "#050505e1",
  },
  locationPressable: {
    width: "auto",
    height: 40,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  locationText: {
    fontSize: 16,
    paddingHorizontal: 4,
  },
  locationIcon: {
    width: 24,
    height: 32,
    justifyContent: "center",
    alignItems: "flex-start",
  },

  mainCardWrapper: {},
  mainFlatListWrapper: {
    width: "100%",
    height: "auto",
    paddingHorizontal: 20,
    overflowX: "hidden",
    marginTop: 20,
  },
  categoriesBtn: {
    width: 100,
    height: 40,
    backgroundColor: "#d9d9d9",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
});

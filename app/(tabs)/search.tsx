import LocationIcon from "@/assets/images/majesticons_map-marker.svg";

import { images } from "@/constants";
import { getCategories, getMenu } from "@/libs/appwrite";
import seed from "@/libs/seed";
import useAppwrite from "@/libs/useAppwrite";
import { Category, MenuItem } from "@/type";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Filter from "../components/Filter";
import SearchBar from "../components/SearchBar";
import useSearchStore from "@/stores/search.store";
import MenuCard from "../components/MenuCard";

export default function SearchScreen() {
  //? You're using the `useLocalSearchParams` hook to access the search parameters from the URL.


  const {isSearching, setIsSearching} = useSearchStore()

  let { category, query } = useLocalSearchParams<{
    category: string;
    query?: string;
  }>();

  //? Then, you're using the `useAppwrite` hook to fetch the menu items based on the category and query parameters. The `getMenu` function is called with the appropriate parameters, and the results are stored in the `data` variable. You also have a `refetch` function that can be used to manually trigger a new fetch when the category or query parameters change.

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
    console.log(`category or query changed ${category} ${query}`);
    if (category !== undefined && query !== undefined) {
      refetch({ category, query, limit: 10 }).catch((error) =>
        console.log(error),
      ).finally(() => 
        setIsSearching(false)
      );
      console.log(`refetching with category ${category} and query ${query}`);
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

      <SearchBar />

      {/* Categories Flatlist */}

      <Filter
        categories={categories ? (categories as unknown as Category[]) : []}
      />
      <View style={searchPageStyles.container}>
        {isSearching ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        ''
      )}
      </View>

      <FlatList
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        keyExtractor={(item) => item.$id}
        style={styles.mainFlatListWrapper}
        data={data}
        renderItem={({ item }) => (
         <MenuCard item={item as unknown as MenuItem} />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainFlatListWrapper: {
    width: "100%",
    height: "auto",
    paddingHorizontal: 20,
    overflowX: "hidden",
    marginTop: 20,
  },
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
    paddingHorizontal: 20,
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
});


let searchPageStyles = StyleSheet.create({
  container: {
    width: "100%",
    height: 'auto',
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "red",
  },
});

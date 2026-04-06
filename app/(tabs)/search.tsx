import LocationIcon from "@/assets/images/majesticons_map-marker.svg";

import { getCategories, getMenuWithCustomizations } from "@/libs/appwrite";
import seed from "@/libs/seed";
import useAppwrite from "@/libs/useAppwrite";
import useAuthStore from "@/stores/auth.store";
import useLocationStore from "@/stores/location.store";
import useMenusState from "@/stores/menus.store";
import useSearchStore from "@/stores/search.store";
import { Category, MenuItem } from "@/types/type";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { Fragment, useEffect } from "react";
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
import MenuCard from "../components/MenuCard";
import SearchBar from "../components/SearchBar";

import { images } from "@/constants";
import { getStoredData } from "@/libs/asyncStorage";

export default function SearchScreen() {
  //? You're using the `useLocalSearchParams` hook to access the search parameters from the URL.

  let { address } = useLocationStore();
  const { isSearching, setIsSearching } = useSearchStore();
  const { user } = useAuthStore();
  let { category, query } = useLocalSearchParams<{
    category: string;
    query?: string;
  }>();

  //? Then, i'm using the `useAppwrite` hook to fetch the menu items based on the
  //? category and query parameters. The `getMenu` function is called with the appropriate
  //? parameters, and the results are stored in the `data` variable. You also have a
  //? `refetch` function that can be used to manually trigger a new fetch when the category
  //? or query parameters change.

  let { isLocalized, isLocalizing, menus, setMenus } = useMenusState();

  let { data, refetch, loading, error } = useAppwrite({
    fn: getMenuWithCustomizations,
    params: {
      category: category ? category : "",
      query: query ? query : "",
    },
    skip: isLocalized || isLocalizing,
  });

  let { data: categories } = useAppwrite({
    fn: getCategories,
    skip: false,
  });

  async function searchLocally(category: string, query: string) {
    console.log("menus length:", menus?.length);
    console.log("query:", query); // check what query is
    console.log("category:", category); // check what category is

    let matchedArray = menus?.filter((item) => {
      console.log('matching....')
      let target = item.name.toLowerCase();
      return target.includes(query.toLowerCase());
    });
    if (category.trim().length > 0) {
      let categoryFiltered = matchedArray?.filter(
        (item) => item.category_name === category,
      );
      console.log('reseting menus')
      setMenus(categoryFiltered as MenuItem[]);
    } else {
      console.log('reseting menus')
      setMenus(matchedArray as MenuItem[]);
    }

    console.log("matchedArray:", matchedArray);
    setIsSearching(false);
  }

  useEffect(() => {
    if (isLocalizing) return;

    //? User is in search mode
    let safeCategory = category ? category : "";
    let safeQuery = query ? query : "";

    if (isLocalized && menus && menus.length > 0) {
      //? Local First Search
      if (category === "" && query === "") {
        (async () => {
          const simpleMenu = await getStoredData("mainMenu");
          if (simpleMenu) setMenus(simpleMenu);
        })();
        return;
      }
      try {
        searchLocally(safeCategory, safeQuery);
      } catch (error) {
      } finally {
        setIsSearching(false);
      }
    } else {
      //? Make refetch once local Storage is empty
      //* Search over network
      refetch({ category: safeCategory, query: safeQuery })
        .catch((error) => console.log(error))
        .finally(() => {
          setIsSearching(false);
        });
    }
  }, [category, query, isLocalizing]);

  return (
    <SafeAreaView>
      <TouchableOpacity
        style={styles.seedBtn}
        onPress={() => seed().catch((error) => console.log(error))}
      >
        <Text>Seed Data</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.userBtn}
        onPress={() => console.log(user)}
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
            <Text style={styles.locationText}>{address}</Text>
          </TouchableOpacity>
        </Pressable>
      </View>

      <SearchBar />

      {/* Categories Flatlist */}

      <Filter
        categories={categories ? (categories as unknown as Category[]) : []}
      />
      {/* <FlatList
        style={circularFilter.cirularFilerMain}
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 10, paddingRight: 40 }}
        renderItem={({ item, index }) => {
          return (
            <View style={circularFilter.circularBtnWrapper}>
              <Pressable style={[circularFilter.circularBtn]}>
                {({ pressed }) => (
                  <Fragment>
                    <View>
                      <Image
                        source={images.coffeeOffer}
                        style={circularFilter.imageStyles}
                        resizeMode="contain"
                      />
                    </View>
                  </Fragment>
                )}
              </Pressable>
              <Text style={circularFilter.btnText}>{item.name}</Text>
            </View>
          );
        }}
      /> */}
      <View style={searchPageStyles.container}>
        {isSearching ? <ActivityIndicator size="large" color="#0000ff" /> : ""}
      </View>

      <FlatList
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle = {styles.contentContainer}
        keyExtractor={(item) => item.$id}
        style={styles.mainFlatListWrapper}
        data={
          (isLocalized && menus && menus.length > 0
            ? menus
            : data) as unknown as MenuItem[]
        }
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
    marginTop: 0,
    marginBottom: 0,
    // backgroundColor  : "yellow"
  },
  contentContainer : {
    paddingBottom : 400,
    marginVertical : 10
  },
  columnWrapper: {
    // backgroundColor  : 'red',
    justifyContent: "space-between",
    marginBottom: 20,
  },
  seedBtn: {
    // display: "none",
    justifyContent: "center",
    alignItems: "center",
    width: 220,
    height: 50,
    backgroundColor: "#6bfa72ed",
  },
  userBtn: {
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
    height: "auto",
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "red",
  },
});

let circularFilter = StyleSheet.create({
  cirularFilerMain: {
    width: "auto",
    height: "auto",
    // backgroundColor  : "red",
    paddingTop: 20,
    paddingLeft: 20,
    marginBottom : 20,
  },
  btnText: {
    fontSize: 10,
    marginTop: 8,
  },
  circularBtn: {
    width: "100%",
    height: 70,
    borderRadius: "50%",
    elevation: 4,
    overflow: "hidden",
  },
  circularBtnWrapper: {
    width: 70,

    // backgroundColor : "red",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
  },
  imageStyles: {
    width: "auto",
    height: "100%",
  },
});


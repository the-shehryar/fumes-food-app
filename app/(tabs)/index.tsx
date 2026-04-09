import LocationIcon from "@/assets/images/majesticons_map-marker.svg";
import Colors from "@/constants/Colors";
import { getCategories, getMenuWithCustomizations } from "@/libs/appwrite";
import { getStoredData, storeData } from "@/libs/asyncStorage";
import { requestLocationPermission } from "@/libs/helpers";
import useAppwrite from "@/libs/useAppwrite";
import useAuthStore from "@/stores/auth.store";
import useLocationStore from "@/stores/location.store";
import useMenusState from "@/stores/menus.store";
import { Category, LocalSearchFilter, MenuItem } from "@/types/type";
import { Ionicons } from "@expo/vector-icons";
import * as MediaLib from "expo-media-library";
import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ViewShot from "react-native-view-shot";
import HeroSlider from "../components/HeroSlider";
import MenuCard from "../components/MenuCard";
import { MenuGridSkeleton } from "../components/skeletons";
let { GRAY_LIGHT, DARK } = Colors;
export default function Index() {
  let { address } = useLocationStore();
  let {
    isLocalized,
    setIsLocalized,
    isCategoriesAvailable,
    setIsCategoriesAvailable,
    setCategories,
    setMenus,
    menus,
    setIsLocalizing,
  } = useMenusState();
  let { isAuthenticated } = useAuthStore();
  let [topRated, setTopRated] = useState<MenuItem[]>([]);
  // let { data, loading, error, refetch } = useAppwrite({
  //   fn: getTopRatedMenu,
  //   params: {
  //     category: "",
  //     query: "",
  //     limit: 6,
  //   },
  //   skip: !isAuthenticated,
  // });

  let { data: fetchedMenus, loading: loadingMenus } = useAppwrite({
    fn: getMenuWithCustomizations,
    params: {
      category: "",
      query: "",
    },
    skip: !isAuthenticated || isLocalized,
  });

  let { data: categories } = useAppwrite({
    fn: getCategories,
    skip: false,
  });

  let { user } = useAuthStore();
  let { setAddress } = useLocationStore();
  const HeaderComponent = () => (
    <>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
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
        <View
          style={{
            paddingHorizontal: 20,
            height: "100%",
            // backgroundColor: "red",
            justifyContent : "center",
            alignItems : 'center'
          }}
        >
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name={'receipt-outline'} size={18} color={DARK} />
            {/* <Ionicons name="menu" size={22} color={DARK} /> */}
          </TouchableOpacity>
        </View>
      </View>
      <HeroSlider />
    </>
  );

  //? Requesting User Permision for Location

  async function registerUserLocation() {
    let location = await requestLocationPermission();
    if (location) {
      setAddress(location.compactAddress);
    } else {
      setAddress("Unknown Location");
    }
  }

  async function loadTopRatedMenu(options: LocalSearchFilter) {
    try {
      let toprated = await getStoredData("mainMenu", {
        limit: options.limit,
        filter: options.filter,
        criteria: options.criteria
          ? { type: options.criteria?.type, value: options.criteria?.value }
          : {},
      });
      setTopRated(toprated as MenuItem[]);
    } catch (error) {
      console.log(error);
    }
  }
  //High Quality Screenshot
  const viewShotRef = useRef<ViewShot>(null);
  const onCapture = async () => {
    try {
      // Capture the view and get the URI
      const uri = await viewShotRef.current?.capture?.();
      console.log("Image saved to:", uri);
    } catch (error) {
      console.error("Capture failed:", error);
    }
  };

  useEffect(() => {
    //? Location Permission
    registerUserLocation();

    if (loadingMenus) {
      setIsLocalizing(true);
      return;
    }
    if (!loadingMenus && fetchedMenus) {
      //? Once the getMenuWithCustomization is completed
      try {
        let menusInString = JSON.stringify(fetchedMenus);
        //? Localize the data to aysnc storage
        let categoriesInString = JSON.stringify(categories);
        storeData(categoriesInString, "categories").catch((err) =>
          console.log(err),
        );
        console.log(categories);
        setCategories(categories as unknown as Category[]);
        setIsCategoriesAvailable(true);
        storeData(menusInString, "mainMenu").catch((error) =>
          console.log(error),
        );
        setMenus(fetchedMenus as unknown as MenuItem[]);
        loadTopRatedMenu({
          limit: 6,
          filter: "rating",
          criteria: {
            type: "equals",
            value: 4,
          },
        });
        setIsLocalized(true);
      } catch (error) {
        console.log(error);
        setIsLocalized(false);
      } finally {
        setIsLocalizing(false);
      }
    }
  }, [loadingMenus]);
  return (
    <View style={{ flex: 1, backgroundColor: "#FFF" }}>
      <StatusBar barStyle={"dark-content"} />
      <ViewShot
        ref={viewShotRef}
        options={{ format: "png", quality: 1.0 }}
        onCapture={async (uri) => {
          await MediaLib.saveToLibraryAsync(uri);
          console.log("Screenshot saved to gallery:", uri);
        }}
        style={{ flex: 1, backgroundColor: "#fff" }}
        captureMode="mount"
      >
        <SafeAreaView edges={["top", 'bottom']} style={{ backgroundColor: "#fff" }}>
          <FlatList
            numColumns={2}
            columnWrapperStyle={cardListStyles.columnWrapper}
            keyExtractor={(item) => item.$id}
            style={[cardListStyles.mainFlatListWrapper]}
            data={topRated}
            ListHeaderComponent={HeaderComponent}
            renderItem={({ item }) => (
              <MenuCard item={item as unknown as MenuItem} />
            )}
            ListEmptyComponent={<MenuGridSkeleton count={6} />}
          />
        </SafeAreaView>
      </ViewShot>
    </View>
  );
}

let styles = StyleSheet.create({
  mainView: {
    width: "100%",
    height: 220,
    marginTop: 24,
    // marginBottom : 100,
    overflowX: "hidden",
    paddingHorizontal: 30,
    backgroundColor: "#FFF",
  },
  offerContainer: {
    flexDirection: "row",
    // borderRightColor : "#fff",
    width: 380,
    height: 180,
    marginBottom: 10,
    backgroundColor: "#ffffff",
    shadowColor: "#00000060",
    shadowOpacity: 100,
    shadowRadius: 40,
    paddingLeft: 24,
    paddingRight: 24,
    borderRadius: 16,
    marginHorizontal: 4,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 2 },
    elevation: 25,
  },
  imageWrapper: {
    width: 140,
    height: 140,
    overflow: "hidden",
    justifyContent: "center",
    borderRadius: 12,
    // backgroundColor: "violet",
  },
  imageStyles: {
    width: "auto",
    height: 180,
    // maxHeight: 300,
  },
  detailsWrapper: {
    width: 200,
    height: 120,
    maxHeight: 160,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingLeft: 12,
    // backgroundColor: "yellow",
  },
  offerText: {
    color: "#000",
    fontSize: 16,
    wordWrap: "no-wrap",
    fontWeight: "bold",
    justifyContent: "flex-start",
  },
  offerTag: {
    fontSize: 8,
    color: "#FF611D",
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  miniDesc: {
    fontSize: 10,
    color: "#6e6e72",
    marginVertical: 1,
  },
  offerPromotion: {
    fontSize: 4,
  },

  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#030303",
  },
  button: {
    width: 160,
    height: 40,
    backgroundColor: "#FF611D",
    padding: 5,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  background: {
    borderRadius: 2,
  },
  locationWrapper: {
    width: "auto",
    maxWidth: "70%",
    height: 80,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    // backgroundColor : "red"
  },
  locationHeaderText: {
    fontSize: 12,
    fontWeight: 600,
    color: "#050505e1",
  },
  locationPressable: {
    width: "auto",
    height: 40,
    // backgroundColor : "green",
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
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 25,
    backgroundColor: GRAY_LIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
});

let popularSectionStyles = StyleSheet.create({
  mainHeading: {
    color: "#000",
    fontSize: 24,
  },
  secondaryText: {
    color: "#10cf90",
    fontSize: 24,
  },
});
let cardListStyles = StyleSheet.create({
  mainFlatListWrapper: {
    width: "100%",
    height: "auto",
    paddingHorizontal: 0,
    overflowX: "hidden",
    // marginTop: 20,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  cardWrapper: {
    width: "48%",
    height: 260,
    backgroundColor: "#fff",
    borderRadius: 16,
    marginVertical: 8,
    elevation: 10,
    overflow: "hidden",
  },
  cardName: {
    fontSize: 12,
    fontWeight: 600,
    marginVertical: 4,
    minHeight: 20,
    height: 30,
  },
  cardImageWrapper: {
    width: "100%",
    height: 160,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  cardImage: {
    width: "100%",
    height: "110%",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  cardContentWrapper: {
    width: "100%",
    height: 100,
    paddingHorizontal: 10,
  },
  ctaBlock: {
    width: "100%",
    height: 40,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flexDirection: "row",
    marginTop: 8,
  },
  priceBlock: {
    width: "44%",
    height: "100%",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  priceHead: {
    fontSize: 8,
  },
  priceText: {
    fontWeight: 600,
    fontSize: 20,
  },
  buttonsWrapper: {
    width: "56%",
    paddingLeft: 8,
    height: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: "auto",
    height: "auto",
    marginHorizontal: 8,
    // backgroundColor: "#10cf90",
  },
  itemCountWrapper: {
    maxWidth: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor  : "red",
  },
  itemCount: {
    fontSize: 16,
    fontWeight: 600,
  },
});

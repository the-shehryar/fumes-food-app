import { getMenuWithCustomizations, getTopRatedMenu } from "@/libs/appwrite";
import { storeData } from "@/libs/asyncStorage";
import { requestLocationPermission } from "@/libs/helpers";
import useAppwrite from "@/libs/useAppwrite";
import useAuthStore from "@/stores/auth.store";
import useLocationStore from "@/stores/location.store";
import useMenusState from "@/stores/menus.store";
import usePreferencesStore from "@/stores/preferences.store";
import { MenuItem } from "@/types/type";
import { Image as NewImage } from "expo-image";
import * as MediaLib from "expo-media-library";
import { useEffect, useRef } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ViewShot from "react-native-view-shot";
import HeroSlider from "../components/HeroSlider";
import MenuCard from "../components/MenuCard";

export default function Index() {
  let { isLocalized, setIsLocalized } = useMenusState();
  let { isAuthenticated } = useAuthStore();
  let { data, loading, error, refetch } = useAppwrite({
    fn: getTopRatedMenu,
    params: {
      category: "",
      query: "",
      limit: 6,
    },
    skip: false,
  });

  let { data: menus, loading: loadingMenus } = useAppwrite({
    fn: getMenuWithCustomizations,
    params: {
      category: "",
      query: "",
    },
    skip: !isAuthenticated,
  });

  let { user } = useAuthStore();
  let { setAddress } = useLocationStore();
  let { setUserAddresses, userAddresses } = usePreferencesStore();
  const HeaderComponent = () => (
    <>
      <HeroSlider />
      {/*  This flat list will render circular filters circles*/}
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
    console.log(user);
    registerUserLocation();

    if (!loadingMenus) {
      try {
        let menusInString = JSON.stringify(menus);
        //? Localizing
        storeData(menusInString).catch((error) => console.log(error));
        setIsLocalized(true);
      } catch (error) {
        console.log(error);
        setIsLocalized(false);
      }
    }
    // console.log("user - status", JSON.stringify(user, null, 2));
  }, [loading]);
  return (
    <View style={{ flex: 1, backgroundColor: "#FFF" }}>
      {/* <TouchableOpacity
        onPress={onCapture}
        style={{ marginTop: 20, padding: 10, backgroundColor: "black" }}
      >
        <Text style={{ color: "white" }}>Take Screenshot</Text>
      </TouchableOpacity> */}
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
        <SafeAreaView style={{ backgroundColor: "#fff" }}>
          {/* <View style={styles.customTopBarWrapper}></View> */}

          <FlatList
            numColumns={2}
            columnWrapperStyle={cardListStyles.columnWrapper}
            keyExtractor={(item) => item.$id}
            style={[cardListStyles.mainFlatListWrapper]}
            data={data}
            ListHeaderComponent={HeaderComponent}
            renderItem={({ item }) => (
              <MenuCard item={item as unknown as MenuItem} />
            )}
            ListEmptyComponent={
              <ActivityIndicator size={"large"} color={"#de5151"} />
            }
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

import { CategoriesLocal, images } from "@/constants";
import { getMenuWithCustomizations, getTopRatedMenu } from "@/libs/appwrite";
import { storeData } from "@/libs/asyncStorage";
import useAppwrite from "@/libs/useAppwrite";
import useAuthStore from "@/stores/auth.store";
import useLocationStore from "@/stores/location.store";
import useMenusState from "@/stores/menus.store";
import usePreferencesStore from "@/stores/preferences.store";
import { MenuItem } from "@/types/type";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import { Fragment, useEffect } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MenuCard from "../components/MenuCard";

export default function Index() {
  let { isLocalized, setIsLocalized } = useMenusState();

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
    skip: false,
  });

  let { user } = useAuthStore();
  let { setAddress } = useLocationStore();
  let { setUserAddresses, userAddresses } = usePreferencesStore();
  const HeaderComponent = () => (
    <>
      <View style={styles.heroImageWrapper}>
        <Image
          style={styles.dryStyles}
          source={images.burgerBackground}
          resizeMode="contain"
        />
        <Image
          style={styles.transparentBurgerStyles}
          source={images.burgerTransparent}
          resizeMode="contain"
        />
      </View>
      <View style={styles.heroTextWrapper}>
        <View style={styles.slideIndicator}>
          <LinearGradient
            colors={["#FF611D", "#FFA680"]}
            style={styles.background}
          >
            <View style={styles.firstArm}></View>
          </LinearGradient>

          <View style={styles.indicatorTextWrapper}>
            <Text style={styles.indicatorTextStyles}>2</Text>
            <Text style={styles.indicatorTextShadowStyles}></Text>
          </View>

          <LinearGradient
            // Background Linear Gradient
            colors={["#FF611D", "#FFA680"]}
            style={styles.background}
          >
            <View style={styles.secondArm}></View>
          </LinearGradient>
        </View>

        <View style={styles.slideText}>
          <View>
            <Text style={{ fontSize: 24, fontWeight: "600", color: "#000" }}>
              A Special Dish with —{" "}
            </Text>
            <Text style={{ fontSize: 40, fontWeight: "900", color: "#FF611D" }}>
              Endless Taste
            </Text>
          </View>
          <View>
            <Text style={{ fontSize: 12, color: "#6e6e72" }}>
              Close your eyes on the first bite, and you'll swear you're
              standing in a sun-drenched Mediterranean kitchen.
            </Text>
          </View>
        </View>
      </View>

      {/*  This flat list will render circular filters */}

      <FlatList
        style={circularFilter.cirularFilerMain}
        data={CategoriesLocal}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => {
          return (
            <View style={circularFilter.circularBtnWrapper}>
              <Pressable style={[circularFilter.circularBtn]}>
                {({ pressed }) => (
                  <Fragment>
                    <View>
                      <Image
                        source={item.image}
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
      />
    </>
  );

  async function requestLocationPermission() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Location permission denied");
      return;
    }
    // ✅ permission granted, get location
    const location = await Location.getCurrentPositionAsync({});

    const [address] = await Location.reverseGeocodeAsync({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
    let city = address.city ?? "Unknown City";
    let country = address.country ?? "Unknown Country";
    let compiledAddress = city + ", " + country;

    setAddress(compiledAddress);
  }

  useEffect(() => {
    //? Location Permission
    requestLocationPermission();

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
    console.log("user - status", JSON.stringify(user, null, 2));
  }, [loadingMenus]);

  return (
    <SafeAreaView style={{ backgroundColor: "#fff" }}>
      {/* <View style={styles.customTopBarWrapper}></View> */}

      <FlatList
        numColumns={2}
        columnWrapperStyle={cardListStyles.columnWrapper}
        keyExtractor={(item) => item.$id}
        style={cardListStyles.mainFlatListWrapper}
        data={data}
        ListHeaderComponent={HeaderComponent}
        renderItem={({ item }) => (
          <MenuCard item={item as unknown as MenuItem} />
        )}
      />
    </SafeAreaView>
  );
}

let styles = StyleSheet.create({
  heroTextWrapper: {
    width: "100%",
    height: 140,
    overflow: "visible",
    flexDirection: "row",
    // backgroundColor: "violet",
  },
  fragmentStyles: {
    marginBottom: 100,
  },
  slideIndicator: {
    width: "16%",
    height: "100%",
    // backgroundColor: "#10cf90",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  slideText: {
    width: "70%",
    height: "100%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  firstArm: {
    width: 4,
    height: "16%",
  },
  secondArm: {
    width: 4,
    height: "50%",
    borderRadius: 2,
  },
  indicatorTextWrapper: {
    // width : '100%',
    height: "24%",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    // backgroundColor  : "red"
  },
  indicatorTextStyles: {
    fontSize: 14,
    fontWeight: "bold",
    zIndex: 10,
  },
  indicatorTextShadowStyles: {
    backgroundColor: "#00000020", // Shadow color with opacity
    width: 10,
    height: 10,
    bottom: 4,
    left: -4,
    zIndex: 4,
    filter: "blur(4px)",
  },
  customTopBarWrapper: {
    width: "100%",
    height: 40,
    backgroundColor: "#fff",
  },
  heroImageWrapper: {
    width: "100%",
    height: 340,
    position: "relative",
  },
  dryStyles: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  transparentBurgerStyles: {
    width: "100%",
    height: "80%",
    position: "absolute",
    top: "10%",
  },
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
    // width : 80,
    // height : 80
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
    // marginBottom : 4
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
    marginTop: 20,
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

let circularFilter = StyleSheet.create({
  cirularFilerMain: {
    width: "auto",
    height: "auto",
    paddingTop: 20,
    paddingLeft: 20,
    marginBottom: 40,
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

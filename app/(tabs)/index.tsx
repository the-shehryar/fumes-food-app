import { images, Offers } from "@/constants";
import { OfferStructure } from "@/types/offerStructure.type";
import Feather from "@expo/vector-icons/Feather";
import { LinearGradient } from "expo-linear-gradient";
import { Fragment, useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button
} from "react-native";
import * as Sentry from '@sentry/react-native'
import { SafeAreaView } from "react-native-safe-area-context";
import useAuthStore from "@/stores/auth.store";

export default function Index() {
  let [offers, setOffers] = useState<OfferStructure[]>([]);
  let backupOffer = [];



  let {user} = useAuthStore()
  

  useEffect(() => {
    console.log("user - lo", JSON.stringify(user, null, 2))
    // fetchOffers();
  }, []);

  // let fetchOffers = async () => {
  //   // First we try to connect to appwrite.
  //   try {
  //     let offerData = await databases.listRows({
  //       databaseId: DATABASE_ID,
  //       tableId: "offers",
  //       queries: [],
  //     });
  //     let testItem = offerData.rows.map((item) => {
  //       return {
  //         name: item.name,
  //         id: item.id,
  //         price: item.price,
  //         items: item.items,
  //       };
  //     });

  //     //! Here is the problem. can't set the response to desired type
  //     console.log(testItem);
  //     backupOffer = testItem;
  //     console.log("wolfing");
  //     console.log(backupOffer);
  //     // setOffers(testItem as unknown as OfferStructure[]);
  //     // console.log(offerData.rows)
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     console.log(offers);
  //   }
  // };

  return (
    <SafeAreaView style={{ backgroundColor: "#fff" }}>
      <ScrollView>
        <View style={styles.customTopBarWrapper}></View>
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
              <Text
                style={{ fontSize: 40, fontWeight: "900", color: "#FF611D" }}
              >
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

        <View
          style={{
            width: "100%",
            marginTop: 40,
            paddingHorizontal: 30,
            height: 30,
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <Text style={{ fontSize: 24, fontWeight: "900" }}>
            Popular Offers
          </Text>
        </View>
        <FlatList
          style={styles.mainView}
          data={Offers}
          horizontal
          renderItem={({ item, index }) => {
            return (
              <View>
                <Pressable style={[styles.offerContainer]}>
                  {({ pressed }) => (
                    <Fragment>
                      <View style={styles.imageWrapper}>
                        <Image
                          source={item.image}
                          style={styles.imageStyles}
                          resizeMode="contain"
                        />
                      </View>
                      <View style={styles.detailsWrapper}>
                        <Text style={styles.offerTag}>{item.tag}</Text>
                        <Text style={styles.offerText}>{item.name}</Text>
                        <Text style={styles.miniDesc}>{item.description}</Text>
                        <TouchableOpacity
                          style={styles.button}
                          onPress={() => console.log(user)}
                        >
                          <Text style={{fontSize : 10, marginHorizontal :  4, color : '#fff'}}>Order Now</Text>
                          <Feather name="arrow-right" color={'#fff'} size={8}/>
                        </TouchableOpacity>
                        {/* <Text style={styles.offerPromotion}>Enjoy 50% Off</Text> */}
                      </View>
                    </Fragment>
                  )}
                </Pressable>
              </View>
            );
          }}
        ></FlatList>
        
      </ScrollView>
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
  fragmentStyles: {},
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
    height: 200,
    marginTop: 24,
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
    shadowColor: "#000000",
    shadowOpacity: 100,
    shadowRadius: 40,
    paddingLeft: 24,
    paddingRight: 24,
    borderRadius: 16,
    marginHorizontal: 4,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 2 },
    elevation: 50,
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
  offerPromotion : {
    fontSize : 4
  },

  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#030303",
  },
  button: {
    width : 160,
    height : 40,
    backgroundColor: "#FF611D",
    padding: 5,
    borderRadius: 5,
    justifyContent : 'center',
    alignItems : "center",
    flexDirection :"row"
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

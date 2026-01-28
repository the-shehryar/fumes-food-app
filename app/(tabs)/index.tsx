import { Offers } from "@/constants";
import { DATABASE_ID, databases } from "@/libs/appwrite";
import { OfferStructure } from "@/types/offerStructure.type";
import Feather from "@expo/vector-icons/Feather";
import { Fragment, useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  let [offers, setOffers] = useState<OfferStructure[]>([]);
  let backupOffer = [];

  useEffect(() => {
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
    <SafeAreaView>
      <FlatList
        style={styles.mainView}
        data={Offers}
        renderItem={({ item, index }) => {
          return (
            <View>
              <Pressable
                style={[styles.offerContainer, { backgroundColor: item.color }, (index+1) % 2 === 0 ? {flexDirection : 'row'} : {flexDirection : "row-reverse"}]}
              >
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
                      <Text style={styles.offerText}>{item.name}</Text>
                      <Feather
                        name="arrow-right-circle"
                        size={32}
                        color="#fdf13f"
                      />
                    </View>
                  </Fragment>
                )}
              </Pressable>
            </View>
          );
        }}
      ></FlatList>
    </SafeAreaView>
  );
}

let styles = StyleSheet.create({
  mainView: {
    backgroundColor: "#FFF",
  },
  offerContainer: {
    flex: 1,
    height: 200,
    marginBottom: 10,
    // flexDirection: "row-reverse",
    backgroundColor: "#dfdfdf",
    // borderColor  : "#a8a8a8",
    // borderWidth : 2,
    shadowColor: "#000000",
    shadowOpacity: 100,
    shadowRadius: 40,
    paddingLeft: 20,
    paddingRight: 10,
    borderRadius: 16,
    justifyContent: "space-around",
    marginLeft: 2,
    marginRight: 2,
    fontFamily: "Poppins",
  },
  imageWrapper: {
    width: 220,
    height: 200,
    overflow: "hidden",
    // backgroundColor  : "violet"
  },
  imageStyles: {
    width: "auto",
    height: 220,
    maxHeight: 300,
  },
  detailsWrapper: {
    minWidth: 80,
    maxWidth: 160,
    height: "auto",
    maxHeight: 200,
    justifyContent: "center",
    alignItems: "flex-start",
    // backgroundColor  : "yellow"
  },
  offerText: {
    color: "#fff",
    fontSize: 30,
    wordWrap : 'no-wrap',
    fontWeight: "900",
    // width : 80,
    // height : 80
  },
});

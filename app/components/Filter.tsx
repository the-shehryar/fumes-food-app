import { Category } from "@/types/type";
import { router, useLocalSearchParams } from "expo-router";
import React, { Fragment, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { images } from "@/constants";


const Filter = ({ categories }: { categories: Category[] }) => {
  const searchParams = useLocalSearchParams();
  const [active, setActive] = useState(searchParams.category || "all");

  const handlePress = (id: string, query?: string) => {
    console.log(`pressed category ${id} with query ${query}`);
    setActive(id);
    if (id === "all") router.setParams({ category: "" });
    else {
      router.setParams({
        category: id,
        query: query !== undefined ? query : "",
      });
    }
  };

  const filterData: (Category | { $id: string; name: string })[] = categories
    ? [{ $id: "all", name: "All" }, ...categories]
    : [{ $id: "all", name: "All" }];

  // console.log(`filter data ${JSON.stringify(filterData)}`);
  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.$id}
      style={styles.mainFlatListWrapper}
      data={filterData}
      renderItem={({ item }) => (
        // <TouchableOpacity
        //   style={[
        //     styles.categoriesBtn,
        //     item.$id === active ? styles.activeCategoryBtn : null,
        //   ]}
        //   onPress={() => handlePress(item.$id, searchParams.query as string)}
        // >
        //   <Text style={item.$id === active ? styles.activeCategoryText : null}>
        //     {item.name}
        //   </Text>
        // </TouchableOpacity>
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
      )}
    />
  );
};

export default Filter;

let styles = StyleSheet.create({
  activeCategoryBtn: {
    backgroundColor: "#ff611d",
  },
  activeCategoryText: {
    color: "#fff",
  },
  mainFlatListWrapper: {
    width: "100%",
    height: 140,
    overflowX: "hidden",
    margin: 20,
    marginBottom: 4,
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

let circularFilter = StyleSheet.create({
  cirularFilerMain: {
    width: "auto",
    height: "auto",
    // backgroundColor  : "red",
    paddingTop: 20,
    paddingLeft: 20,
    marginBottom: 20,
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

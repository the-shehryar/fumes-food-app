import { Category } from "@/type";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity } from "react-native";

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
        <TouchableOpacity
          style={[
            styles.categoriesBtn,
            item.$id === active ? styles.activeCategoryBtn : null,
          ]}
          onPress={() => handlePress(item.$id, searchParams.query as string)}
        >
          <Text style={item.$id === active ? styles.activeCategoryText : null}>
            {item.name}
          </Text>
        </TouchableOpacity>
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
    height: 50,
    // paddingHorizontal: 20,
    overflowX: "hidden",
    margin: 20,
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

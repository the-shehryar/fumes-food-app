import { optimizeCloudinaryUrl } from "@/libs/helpers";
import { Category } from "@/types/type";
import { router, useLocalSearchParams } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const Filter = ({ categories }: { categories: Category[] }) => {
  const searchParams = useLocalSearchParams();
  const [active, setActive] = useState<string>(
    (searchParams.category as string) || "all",
  );
  const scaleAnims = useRef<Record<string, Animated.Value>>({}).current;

  const DEFAULT_ACTIVE = "All";

  const getScale = (id: string, name: string) => {
    if (!scaleAnims[id]) {
      scaleAnims[id] = new Animated.Value(name === DEFAULT_ACTIVE ? 1.1 : 1);
    }
    return scaleAnims[id];
  };
  const handlePress = (id: string, name: string, query?: string) => {
    if (scaleAnims[active]) {
      Animated.spring(scaleAnims[active], {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
    // Scaling up new active
    Animated.spring(getScale(id, name), {
      toValue: 1.1,
      useNativeDriver: true,
      damping: 12,
      stiffness: 180,
    }).start();

    setActive(id);
    if (name === "All") router.setParams({ category: "" });
    else {
      router.setParams({
        category: id,
        query: query !== undefined ? query : "",
      });
    }
  };

  const filterData: (
    | Category
    | { $id: string; name: string; image: string }
  )[] = categories ? [...categories] : [{ $id: "all", name: "All", image: "" }];

  // console.log(filterData[0]);
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
          onPress={() =>
            handlePress(item.$id, item.name, searchParams.query as string)
          }
        >
          <Animated.View
            style={[
              circularFilter.circularBtnWrapper,
              { transform: [{ scale: getScale(item.$id, item.name) }] },
            ]}
          >
            <View
              style={[
                circularFilter.circularBtn,
                item.$id === active ? circularFilter.activeBtn : null,
              ]}
            >
              <Image
                source={{ uri: optimizeCloudinaryUrl(item.image, 200, 200) }}
                style={circularFilter.imageStyles}
                resizeMode="cover"
              />
            </View>
            <Text
              style={[
                circularFilter.btnText,
                item.$id === active ? circularFilter.activeBtnText : null,
              ]}
            >
              {item.name}
            </Text>
          </Animated.View>
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
    height: 160,
    overflowX: "hidden",
    margin: 20,
    marginBottom: 4,
    // backgroundColor  : "green"
  },
  categoriesBtn: {
    width: 70,
    height: 70,
    backgroundColor: "#d9d9d9",
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    elevation: 4,
  },
});
let circularFilter = StyleSheet.create({
  circularBtnWrapper: {
    // backgroundColor : "red",
    width: 70,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
  },
  circularBtn: {
    width: 70,
    height: 70,
    borderRadius: 35, 
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "transparent",
  },
  activeBtn: {
    elevation: 24,
    borderColor: "#ff611d", 
  },
  imageStyles: {
    width: "100%", 
    height: "100%",
  },
  btnText: {
    fontSize: 10,
    marginTop: 6,
    textAlign: "center",
  },
  activeBtnText: {
    color: "#111",
    fontWeight: "700",
  },
});

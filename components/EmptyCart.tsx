import { images } from "@/constants/index";
import { Link } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export default function EmptyCart() {
  return (
    <View style={EmptyCartStyles.wrapper}>
      <Image
        style={EmptyCartStyles.imageStyles}
        source={images.emptyCartBackground}
      />
      <Text style={EmptyCartStyles.majorHeading}>Oppss ... Seems Empty</Text>
      <View style={EmptyCartStyles.secondaryContent}>
        <Text>You might like some</Text>
        <Link
          href={{
            pathname: "/(tabs)/search",
            params: { query: "pizza", category : "" },
          }}
          asChild // Use asChild if wrapping with a custom Pressable/Button
          onPress={() => {}}
        >
          <Text style={EmptyCartStyles.linkedText}>Pizza</Text>
        </Link>
      </View>
    </View>
  );
}

const EmptyCartStyles = StyleSheet.create({
  wrapper: {
    width: "100%",
    height: "auto",
    justifyContent: "center",
    alignItems: "center",
  },
  imageStyles: {
    marginTop: 60,
    width: "80%",
  },
  majorHeading: {
    fontSize: 24,
    color: "#6E6E72",
  },
  secondaryContent: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  linkedText: {
    fontSize: 16,
    color: "#ff611d",
    marginHorizontal: 4,
    fontWeight: 600,
  },
});

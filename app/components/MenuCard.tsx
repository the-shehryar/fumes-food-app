import AddButton from "@/assets/images/Product-Add-Btn.svg";
import SubstractBtn from "@/assets/images/Product-Subtract-Btn.svg";
import { images } from "@/constants/index";
import { useCartStore } from "@/stores/cart.store";
import {MenuItem, CartCustomization} from "@/type";
import React, { use } from "react";
import { Image, Text, TouchableOpacity, View, StyleSheet } from "react-native";

const MenuCard = ({item}: {
  item: MenuItem;
}) => {

  let { addItem}  = useCartStore();

  const handleAddToCart = () => {
    addItem({
      id: item.$id,
      name: item.name,
      description : item.description,
      image_url: images.sandwichOffer, // You can replace this with the actual image URL from the item if available
      price: item.price,
      size : 'regular',
      customizations: [], // You can add default customizations if needed
    });
  }

  return (
    <TouchableOpacity style={cardListStyles.cardWrapper}>
      <View style={cardListStyles.cardImageWrapper}>
        <Image
          style={cardListStyles.cardImage}
          resizeMode="cover"
          source={images.sandwichOffer}
        />
      </View>
      <View style={cardListStyles.cardContentWrapper}>
        <Text
          numberOfLines={2}
          ellipsizeMode="tail"
          style={cardListStyles.cardName}
        >
          {item.name}
        </Text>
        <View style={cardListStyles.ctaBlock}>
          <View style={cardListStyles.priceBlock}>
            <Text style={cardListStyles.priceHead}>STARTING AT</Text>
            <Text style={cardListStyles.priceText}>${item.price}</Text>
          </View>
          <View style={cardListStyles.buttonsWrapper}>
            <TouchableOpacity style={cardListStyles.button}>
              <SubstractBtn width={28} height={28} />
            </TouchableOpacity>
            <View style={cardListStyles.itemCountWrapper}>
              <Text style={cardListStyles.itemCount}>1</Text>
            </View>
            <TouchableOpacity onPress={handleAddToCart} style={cardListStyles.button}>
              <AddButton width={28} height={28} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default MenuCard;

let cardListStyles = StyleSheet.create({
  mainFlatListWrapper: {
    width: "100%",
    height: "auto",
    paddingHorizontal: 20,
    overflowX: "hidden",
    marginTop: 20,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 20,
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

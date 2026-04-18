import AddButton from "@/assets/images/Product-Add-Btn.svg";
import SubstractBtn from "@/assets/images/Product-Subtract-Btn.svg";
import { optimizeCloudinaryUrl } from "@/libs/helpers";
import { useCartStore } from "@/stores/cart.store";
import { CartCustomization, MenuItem } from "@/types/type";
import * as Crypto from "expo-crypto";
import { Image } from "expo-image";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Stars from "./Stars";

const MenuCard = ({ item }: { item: MenuItem }) => {
  // console.log(item.image_url)
  let { items, addItem, removeItem, increaseQty, decreaseQty } = useCartStore();
  // let [cartExistanceCheck, setCartExistanceCheck] = useState<boolean>(false);
  // let [cartQuantity, setCartQuantity] = useState<number>(0);

  const cartItem = items.find((i) => i.id === item.$id);
  const cartExistanceCheck = !!cartItem;
  const cartQuantity = cartItem?.quantity ?? 0;

  const handleAddToCart = () => {

    let isAlreadyInCart = items.find((cartItem) => cartItem.id === item.$id);
    if (isAlreadyInCart) {
      increaseQty(item.$id, item.customizations ?? [] as CartCustomization[]);
    } else {
      addItem({
        id: item.$id,
        name: item.name,
        description: item.description,
        image_url: item.image_url, // You can replace this with the actual image URL from the item if available
        price: item.price,
        sizes: [
          {
            name: "small",
            price: 25.99,
            calories: 550,
            isDefault: true,
            isSelected: true,
            protein: 50,
          },
          {
            name: "large",
            price: 32.0,
            calories: 550,
            isDefault: false,
            isSelected: false,
            protein: 50,
          },
        ],
        customizations: item.customizations,
        rating: item.rating,
        quantity: 1,
        calories: item.calories,
        category_name: item.category_name,
        uid: Crypto.randomUUID(),
      } as any);
    }
  };
  const handleRemoveFromCart = async () => {
    // we check here if the selected item is already in cart
    let isAlreadyInCart = items.find((cartItem) => cartItem.id === item.$id);

    if (isAlreadyInCart !== undefined && isAlreadyInCart?.quantity === 1) {
      removeItem(item.$id, item.customizations ?? [] as CartCustomization[]);
    } else if (isAlreadyInCart !== undefined && isAlreadyInCart?.quantity > 1) {
      decreaseQty(item.$id, item.customizations ?? [] as CartCustomization[]);
    }
  };


  return (
    <Link
      href={{ pathname: "/products/[id]", params: { id: item.$id } }}
      push
      asChild
    >
      <TouchableOpacity style={cardListStyles.cardWrapper}>
        <View style={cardListStyles.cardImageWrapper}>
          <Image
            source={{
              uri: optimizeCloudinaryUrl(item.image_url),
              headers: {
                Referer: "https://res.cloudinary.com",
              },
            }}
            style={cardListStyles.cardImage}
            contentFit="cover"
            onLoad={() => {}}
            onError={(e) => console.log("❌ image error", e)}
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
          <Stars rating={4} />
          <View style={cardListStyles.ctaBlock}>
            <View style={cardListStyles.priceBlock}>
              <Text style={cardListStyles.priceHead}>STARTING AT</Text>
              <Text style={cardListStyles.priceText}>${item.price}</Text>
            </View>
            <View
              style={[
                cardListStyles.buttonsWrapper,
                !cartExistanceCheck
                  ? cardListStyles.buttonToRight
                  : cardListStyles.buttonCentered,
              ]}
            >
              {cartExistanceCheck ? (
                <>
                  <TouchableOpacity
                    onPress={handleRemoveFromCart}
                    style={cardListStyles.button}
                  >
                    <SubstractBtn width={28} height={28} />
                  </TouchableOpacity>
                  <View style={cardListStyles.itemCountWrapper}>
                    <Text style={cardListStyles.itemCount}>{cartQuantity}</Text>
                  </View>
                </>
              ) : (
                ""
              )}

              <TouchableOpacity
                onPress={handleAddToCart}
                style={cardListStyles.button}
              >
                <AddButton width={28} height={28} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

export default MenuCard;

let cardListStyles = StyleSheet.create({
  cardWrapper: {
    width: "48%",
    height: 260,
    backgroundColor: "#fff",
    borderRadius: 16,
    marginVertical: 2,
    elevation: 12,
    overflow: "hidden",
  },
  cardName: {
    fontSize: 12,
    fontWeight: 600,
    marginVertical: 4,
    minHeight: 20,
    height: 20,
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
    height: 160,
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
    alignItems: "center",
  },
  buttonCentered: {
    justifyContent: "center",
  },
  buttonToRight: {
    justifyContent: "flex-end",
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

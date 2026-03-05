import AddButton from "@/assets/images/Product-Add-Btn.svg";
import SubstractBtn from "@/assets/images/Product-Subtract-Btn.svg";
import { images } from "@/constants/index";
import { useCartStore } from "@/stores/cart.store";
import { CartItemType } from "@/type";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CartItem({ item }: { item: CartItemType }) {

  let { increaseQty, decreaseQty}  = useCartStore();

  const handleIncreaseQty = () => {
    increaseQty(
      item.id,
      [], // You can add default customizations if needed
    );
  }
  const handleDecreaseQty = () => {
    decreaseQty(
      item.id,
      [], // You can add default customizations if needed
    );
  }




  return (
    <View style={cartItemStyles.wrapper}>
      <View style={cartItemStyles.imageWrapper}>
        <Image source={images.coffeeOffer} style={cartItemStyles.image} />
      </View>
      <View style={cartItemStyles.contentWrapper}>
        <Text
          numberOfLines={2}
          ellipsizeMode="tail"
          style={cartItemStyles.name}
        >
          {item.name}
        </Text>
        {item.size ? (
          <View style={cartItemStyles.sizeWrapper}>
            <Text style={cartItemStyles.size}>Size :</Text>
            <Text style={cartItemStyles.sizeText}>{item.size}</Text>
          </View>
        ) : (
          ""
        )}
        <View style={cartItemStyles.priceWrapper}>
          <View style={quantityStyles.buttonsWrapper}>
            <TouchableOpacity onPress={handleDecreaseQty} style={quantityStyles.button}>
              <SubstractBtn width={24} height={24} />
            </TouchableOpacity>
            <View style={quantityStyles.itemCountWrapper}>
              <Text style={quantityStyles.itemCount}>{item.quantity}</Text>
            </View>
            <TouchableOpacity onPress={handleIncreaseQty} style={quantityStyles.button}>
              <AddButton width={24} height={24} />
            </TouchableOpacity>
          </View>

          <Text style={cartItemStyles.price}>${item.price}</Text>
        </View>
      </View>
    </View>
  );
}

const cartItemStyles = StyleSheet.create({
  wrapper: {
    width: "94%",
    flexDirection: "row",
    paddingVertical: 10,
    paddingBottom : 20,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    alignItems: "center",
    alignSelf: "center",
  },
  imageWrapper: {
    width: 120,
    height: 120,
    marginRight: 10,
    borderRadius: 16,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  contentWrapper: {
    flex: 1,
    justifyContent: "space-between",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  price: {
    fontSize: 20,
    fontWeight: 600,
    color: "#3C3A45",
  },
  quantity: {
    fontSize: 14,
    color: "#888",
  },
  sizeWrapper: {
    maxWidth: 120,
    minWidth: 60,
    height: 30,
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor : "green"
  },
  size: {
    fontSize: 14,
    color: "#888",
  },
  sizeText: {
    color: "#FF611D",
    fontSize: 14,
    textTransform: "capitalize",
    marginLeft: 4,
  },
  priceWrapper: {
    height: 50,
    borderRadius: 8,
    paddingRight: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

const quantityStyles = StyleSheet.create({
  buttonsWrapper: {
    width: "40%",
    height: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
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

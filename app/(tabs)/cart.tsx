import { useCartStore } from "@/stores/cart.store";
import { useEffect } from "react";
import {
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CartItem from "../components/CartItem";
import CheckoutFormSheet from "../components/CheckoutFormSheet";
import EmptyCart from "../components/EmptyCart";
import { Link } from "expo-router";

export default function CartScreen() {
  const {
    items,
    addItem,
    removeItem,
    increaseQty,
    decreaseQty,
    clearCart,
    getTotalItems,
    getTotalPrice,
  } = useCartStore();

  const total = getTotalItems();
  const totalPrice = getTotalPrice();

  useEffect(() => {
    console.log("Cart Items:", items);
    console.log("Total Items:", total);
    console.log("Total Price:", totalPrice);
  }, [items, total, totalPrice]);
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "flex-start",
          alignItems: "flex-start",
          backgroundColor: "#fefefe",
        }}
      >
        {/* <Text>{total} items in cart</Text>
      <Text>${totalPrice.toFixed(2)} total price</Text> */}

        <View style={{
            width : "100%",
            height : 60,
            justifyContent : "center",
            alignItems : 'center',
            elevation : 5,
            shadowColor : "#00000069"
            // backgroundColor : "red"
        }}>
          <Text style={{
            fontWeight : 600,
            fontSize : 18,
            marginBottom : 20,
          }}>Shopping Cart</Text>
        </View>

        {items.length > 0 ? (
          <>
            <View style={{ width : "100%", height: Dimensions.get("window").height - 560 }}>
              <FlatList
                style = {{width : '100%'}}
                data={items}
                renderItem={({ item }) => {
                  return <CartItem item={item} />;
                }}
                keyExtractor={(item) => item.id}
              />
            </View>
            <CheckoutFormSheet />
          </>
        ) : (
          <EmptyCart />
        )}
        {/* <CheckoutFormSheet/> */}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

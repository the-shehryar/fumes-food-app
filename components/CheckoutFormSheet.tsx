import { useCartStore } from "@/stores/cart.store";
import { useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Divider from '@/assets/images/dashed-border.svg';
import CustomButton from "./CustomButton";
import CouponInput from "./CouponInput";

export function CheckoutInfoGroup({
  title,
  amount,
}: {
  title: string;
  amount: number;
}) {
  return (
    <View style={infoStyles.wrapper}>
      <Text style={infoStyles.title}>{title}</Text>
      <Text style={infoStyles.amount}>${amount.toFixed(2)}</Text>
    </View>
  );
}

export default function CheckoutFormSheet() {
  let { getTotalPrice, items } = useCartStore();
  let checkoutTotal = getTotalPrice();

  useEffect(() => {
    checkoutTotal = getTotalPrice();
    console.log("Total Price in CheckoutFormSheet:", getTotalPrice());
  }, [items, getTotalPrice]);

  return (
    <View style={checkoutFormSheetStyles.wrapper}>
        <CouponInput/>
      <View>
        <CheckoutInfoGroup title={"Subtotal"} amount={checkoutTotal} />
        <CheckoutInfoGroup title={"Delivery Charges"} amount={6.44} />
        <CheckoutInfoGroup title={"Promo Code"} amount={4} />
        <Divider style={infoStyles.divider} width={'100%'}></Divider>
        <CheckoutInfoGroup title={"Total Amount"} amount={checkoutTotal + 6.44 - 4} />
      </View>
      <TouchableOpacity style={{marginTop : 20, paddingHorizontal : 20}}>
        <CustomButton title="Proceed to Checkout" style="big-filled" color="#FF611D" textStyle="#fff"/>
      </TouchableOpacity>
    </View>
  );
}
const checkoutFormSheetStyles = StyleSheet.create({
  wrapper: {
    width: "100%",
    height: 350,
    backgroundColor: "#fefefe",
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderColor: "#ccc",
    borderWidth: 2,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 20,
  },
});
const infoStyles = StyleSheet.create({
  wrapper: {
    width: "100%",
    height: 30,
    maxHeight: 60,
    // backgroundColor: "#fff",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 4,
  },

  title: {
    color: "#888",
    fontSize: 14,
    fontWeight: "600",
  },
  amount: {
    color: "#3C3A45",
    fontSize: 14,
    fontWeight: "600",
  },
  divider: {
    width: "100%",
    height: 'auto',
    marginVertical : 10,
  },
});

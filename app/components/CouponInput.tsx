import Discount from "@/assets/images/discount.svg";
import { getValueFromKey } from "@/libs/global";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { useDebouncedCallback } from "use-debounce";
// import { TextInput } from "react-native-gesture-handler";

export default function CouponInput() {
  let [code, setCode] = useState("");
  let [promoApplied, setPromoApplied] = useState<boolean>(false);
  let [isEditable, setIsEditable] = useState<boolean>(true);
  let [discountValue, setDiscountValue] = useState<number>(0)

  let availableCodes = {NEWFUMES : '5', NEW10 : '10', KML15 : '15'};

  const debouceState = useDebouncedCallback((text: string) => {
    setCode(text);
  }, 500);

  




//? Handle on change text

  function handlePromo(text: string) {
    debouceState(text);
  }

  function applyCode(text: string) {
    //* Verification
    const promoExists = text in availableCodes

    if(promoExists) {
        console.log(getValueFromKey(availableCodes, text as any))
        setPromoApplied(true)
        setIsEditable(false)
        ToastAndroid.show('Discount Applied Successfully', ToastAndroid.LONG)
    }else {
        setPromoApplied(false)
        setIsEditable(true)
        ToastAndroid.show('Invalid Code', ToastAndroid.LONG)
    }
  }
  console.log(code);
  return (
    <View style={couponInputStyles.wrapper}>
      <Discount width={24} height={24} />
      <TextInput
        editable={isEditable}
        onChangeText={handlePromo}
        style={couponInputStyles.input}
        placeholder="NEWFUMES"
      />
      <TouchableOpacity
        onPress={() => applyCode(code)}
        style={[
          !promoApplied
            ? { backgroundColor: "#FF611D" }
            : { backgroundColor: "#FFE9DF" },
          couponInputStyles.cta,
        ]}
      >
        <Text
          style={[
            !promoApplied
              ? couponInputStyles.textRegular
              : couponInputStyles.textApplied,
          ]}
        >
          {!promoApplied ? "Apply" : "Applied"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
const couponInputStyles = StyleSheet.create({
  wrapper: {
    width: "84%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 8,
    justifyContent: "flex-start",
    alignItems: "center",
    elevation: 20,
    shadowColor: "#00000060",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
    alignSelf: "center",
  },
  input: {
    textTransform: "uppercase",
    color: "#6E6E72",
    fontSize: 12,
    width: "60%",
    fontWeight: 600,
    marginLeft: 12,
    outline: "none",
  },
  cta: {
    width: "auto",
    padding: 8,
    borderRadius: 4,
    paddingHorizontal: 20,
  },

  textRegular: { color: "#fff" },
  textApplied: { color: "#FF611D" },
});

import Colors from "@/constants/Colors";
import { CustomButtonProps } from "@/types/type";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

let {ORANGE, WHITE} = Colors

function CustomButton({
  size,
  onPressTouch,
  title,
  icon,
  style,
  leftIcon,
  textStyle,
  isLoading = false,
  color,
  value,
}: CustomButtonProps) {
  return (
    <TouchableOpacity
      style={[
        style === "big-filled" ? styles.oauthBtnStyles : styles.placeOrderBtn,
        { backgroundColor: color },
      ]}
      onPress={onPressTouch}
    >
      <View>
        {isLoading ? (
          <ActivityIndicator size={"small"} color={"white"} />
        ) : (
          <View style={[style === "big-filled" ? styles.oauthBtnWrapper : ""]}>
            {leftIcon ? icon : <></>}
            <Text
              style={[
                style === "big-filled"
                  ? styles.oauthBtnText
                  : styles.placeOrderText,
                { color: textStyle },
              ]}
            >
              {title}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default CustomButton;

let styles = StyleSheet.create({
  customBtnStyles: {
    width: 140,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
  },
  customBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  oauthBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  oauthBtnStyles: {
    width: "auto",
    marginLeft: 40,
    marginRight: 40,
    marginBottom: 20,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
  },
  oauthBtnWrapper: {
    width: "100%",
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  btnAuthIcon: {
    marginHorizontal: 8,
  },


    placeOrderBtn: {
    // flex: 1,
    height : 55,
    width : "60%",
    backgroundColor: ORANGE,
    borderRadius: 14,
    // paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  placeOrderText: {
    color: WHITE,
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
});

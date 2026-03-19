import { CustomSearchInputProps } from "@/types/type";
import Feather from "@expo/vector-icons/Feather";
import React, { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";

const CustomSearchInput = ({
  placeholder = "Enter Text",
  value,
  onChangeText,
  onSubmitEditing = () => {},
  returnKeyType = "done",
  label,
  icon,
  keyboardType = "default",
}: CustomSearchInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <View style={styles.inputWrapper}>
      <View style={styles.inputIcon}>
        {icon ? <Feather size={20} name="search" color={"#d9d9d9"} /> : ""}
      </View>
      <TextInput
        style={[
          styles.basicInputStyle,
          isFocused ? styles.inputFocused : styles.inputBlur,
        ]}
        autoCapitalize="none"
        autoCorrect={false}
        value={value}
        placeholder={placeholder}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        placeholderTextColor={"#d9d9d9"}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false);
        }}
        onSubmitEditing={onSubmitEditing}
        returnKeyType="search"
      />
    </View>
  );
};

let styles = StyleSheet.create({
  inputWrapper: {
    width: "90%",
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderRadius: 4,
    elevation: 24,


    // * use shadow color to change elevation color

    shadowColor: "#524c4c5b",
    overflow: "hidden",
    marginHorizontal: 20,
  },
  labelStyles: {
    marginBottom: 8,
    color: "#ff611d",
  },
  inputIcon: {
    width: 30,
    height: 50,
    marginLeft: 24,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor : "violet"
  },
  basicInputStyle: {
    color: "#000000",
    width: "100%",
    // marginBottom: 20,
    paddingLeft: 10,
    height: 50,
  },
  inputFocused: {
    borderWidth: 0,
  },
  inputBlur: {
    // borderColor: "#6e6e72",
  },
});
export default CustomSearchInput;

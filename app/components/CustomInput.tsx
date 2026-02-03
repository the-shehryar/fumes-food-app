import { CustomInputProps } from "@/type";
import React, { useState } from "react";
import { StyleSheet, TextInput, View, Text } from "react-native";

const CustomInput = ({
  placeholder = "Enter Text",
  value,
  onChangeText,
  label,
  labelVisble = false,
  secureTextEntry,
  keyboardType = "default",
}: CustomInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.inputWrapper}>
      {
        labelVisble ? <Text style={styles.labelStyles}>{label}</Text> : undefined
        }
      <TextInput
        style={[styles.basicInputStyle, isFocused ? styles.inputFocused : styles.inputBlur]}
        autoCapitalize="none"
        autoCorrect={false}
        value={value}
        placeholder={placeholder}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false);
        }}
      />
    </View>
  );
};

let styles = StyleSheet.create({
  inputWrapper : {
    paddingHorizontal : 40
  },
  labelStyles: {
    marginBottom  : 8,
    color : "#ff611d"
  },
  basicInputStyle: {
    marginBottom: 20,
    backgroundColor: "#f5f5f5",
    paddingLeft : 20,
    borderRadius : 4,
    height : 50,
  },
  inputFocused: {
    borderWidth : 1,
    borderColor: "#ff611d",
  },
  inputBlur: {
    // borderColor: "#6e6e72",
  },
  
});
export default CustomInput;

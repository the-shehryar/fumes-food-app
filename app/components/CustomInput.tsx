import React, { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";

const CustomInput = ({
  placeholder = "Enter Text",
  value,
  onChangeText,
  label,
  secureTextEntry,
  keyboardType = "default",
}: CustomInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.inputWrapper}>
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

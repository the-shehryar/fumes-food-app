import Logo from "@/assets/images/applogo.svg";
import { Link, router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import CustomButton from "../components/CustomButton";
import CustomInput from "../components/CustomInput";

import {
  lowerCaseCheckRegex,
  numberCheckRegex,
  passwordRegex,
  specialCharacterCheckRegex,
  upperCaseCheckRegex,
} from "@/constants";
import { SignUpForm } from "@/type";
import Feather from "@expo/vector-icons/Feather";

export default function SignUp() {
  let [errorMessage, setErrorMessage] = useState<string>("");

  let [passwordLevel, setPasswordLevel] = useState({
    lowerCase: false,
    upperCase: false,
    specialCharacter: false,
    numberCharacter: false,
    passwordLength: 0,
  });

  let rules = [
    {
      label: "Atleast one lower case value",
      test: (value: string) => lowerCaseCheckRegex.test(value),
    },
    {
      label: "Atleast one upper case value",
      test: (value: string) => upperCaseCheckRegex.test(value),
    },
    {
      label: "Atleast one number value",
      test: (value: string) => numberCheckRegex.test(value),
    },
    {
      label: "Atleast one special value",
      test: (value: string) => specialCharacterCheckRegex.test(value),
    },
  ];

  let [signUpForm, setSignUpForm] = useState<SignUpForm>({
    name: "",
    email: "",
    password: "",
  });


  const showToast = (message: string) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(message, ToastAndroid.TOP);
    } else {
      // Alert works on both platforms, but looks different from an Android toast
      Alert.alert(message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.signInWrapper}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View>
          <Logo style={styles.logoWrapper} />
          <CustomInput
            placeholder="Name"
            value={signUpForm.name}
            onChangeText={(text) => {
              setSignUpForm((prev) => ({ ...prev, name: text }));
            }}
            label="Name"
            keyboardType="default"
          />
          <CustomInput
            placeholder="Email"
            value={signUpForm.email}
            onChangeText={(text) => {
              setSignUpForm((prev) => ({ ...prev, email: text }));
            }}
            label="Email"
            keyboardType="email-address"
          />
          <CustomInput
            placeholder="Password"
            value={signUpForm.password}
            secureTextEntry
            onChangeText={(text) => {
              setSignUpForm((prev) => ({ ...prev, password: text }));
            }}
            label="Password"
            keyboardType="default"
          />
          <View style={styles.rulesWrapper}>
            {signUpForm.password.length > 0 ? (
              rules.map((rule, index) => {
                let isValid = rule.test(signUpForm.password);
                return (
                  <View key={index} style={styles.ruleStyles}>
                    <Feather
                      name="check"
                      size={12}
                      color={isValid ? "#ff611d" : "#dcdfdf"}
                    />
                    <Text style={{ fontSize: 12, marginLeft: 4 }}>
                      {rules[index].label}
                    </Text>
                  </View>
                );
              })
            ) : (
              <></>
            )}
          </View>

          <View style={styles.CtaBtnWrapper}>
            <CustomButton
              color={"#ff611d"}
              textStyle="#fff"
              leftIcon={false}
              title="Sign Up"
              style="default"
            />
          </View>
          <View style={styles.signInBtnDirector}>
            <Text style={styles.directingLine}>Already have an account?</Text>
            <Link style={styles.underlinedLink} href={"/(auth)/signIn"}>
              SignIn
            </Link>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

let styles = StyleSheet.create({
  eyboardWrapperv: {},
  rulesWrapper: {
    width: "100%",
    paddingHorizontal: 40,
    justifyContent: "center",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  ruleStyles: {
    // backgroundColor : "violet",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    marginVertical: 2,
  },
  signInWrapper: {
    position: "absolute",
    top: Dimensions.get("screen").height / 2.25 - 160,
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    width: "100%",
    height:
      Dimensions.get("screen").height -
      Dimensions.get("screen").height / 2.25 +
      160,
    paddingTop: 48,
  },
  logoWrapper: {
    width: 100,
    height: 50,
    alignSelf: "center",
    justifyContent: "center",
    marginBottom: 64,
  },
  CtaBtnWrapper: {
    width: "100%",
    height: "auto",
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  signInBtnDirector: {
    width: "100%",
    height: "auto",
    marginVertical: 20,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  underlinedLink: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#ff611d",
    textDecorationLine: "underline",
  },
  directingLine: {
    marginHorizontal: 4,
  },

  //   container: {
  //   flex: 1,
  // },
});

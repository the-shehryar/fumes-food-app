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
  specialCharacterCheckRegex,
  upperCaseCheckRegex,
} from "@/constants";
import { createUser } from "@/libs/appwrite";
import { SignUpForm } from "@/type";
import Feather from "@expo/vector-icons/Feather";
import useAuthStore from "@/stores/auth.store";


export default function SignUp() {
  let {user} = useAuthStore() 
  let [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  let [signUpForm, setSignUpForm] = useState<SignUpForm>({
    name: "",
    email: "",
    password: "",
  });
  let { name, email, password } = signUpForm;

  const submitSignUp = async () => {
    console.log(`${email} + ${password} + ${name}`);
    setIsSubmitting(true)
    try {
      !email || !password
        ? Platform.OS === "android"
          ? ToastAndroid.show(
              "Please provide all the required information",
              ToastAndroid.TOP,
            )
          : Alert.alert("Error", "Please provide right info")
        : ''
        if(email && password){
          await createUser({ name, email, password });
          ToastAndroid.show("User Registered Scuccessfully", ToastAndroid.SHORT)
          console.log(user)
          router.replace('/')
        }
    } catch (error:any) {
      let errorString = new Error(error as string)
      console.log(errorString)
      Platform.OS === "android"
        ? ToastAndroid.show(`${errorString}`, ToastAndroid.TOP)
        : Alert.alert("Error", error.message);

      throw new Error(error as string);
    }
    finally {
      setIsSubmitting(false)
    }
  };

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
              onPressTouch={submitSignUp}
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

import Logo from "@/assets/images/applogo.svg";
import { account } from "@/libs/appwrite";
import { Link, router } from "expo-router";
import { useState } from "react";
import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { ID } from "react-native-appwrite";
import CustomButton from "../components/CustomButton";
import CustomInput from "../components/CustomInput";
export default function SignIn() {
  let [signUpForm, setSignUpForm] = useState<SignUpForm>({
    name: "",
    email: "",
    password: "",
  });


  async function handleOnPress() {
    console.log(signUpForm)
    // try {
    //   let userCreation = await account.create({
    //     userId: ID.unique(),
    //     name: signUpForm.name,
    //     email: signUpForm.email,
    //     password: signUpForm.password,
    //   });
    //   console.log("success");
    // } catch (error) {
    //   console.log(error);
    // }
    // router.push("/(auth)/signIn");
    // console.log("tocuhed");
  }
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.signInWrapper}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View>
          <Logo style={styles.logoWrapper} />
          <CustomInput
            placeholder="Name *"
            value={signUpForm.name}
            onChangeText={(text) => {
              setSignUpForm((prev)=> ({...prev, name : text}))
            }}
            label=""
            keyboardType="default"
          />
          <CustomInput
            placeholder="Email"
            value={signUpForm.email}
            onChangeText={(text) => {
              setSignUpForm((prev)=> ({...prev, email : text}))
            }}
            label=""
            keyboardType="email-address"
          />
          <CustomInput
            placeholder="Password"
            value={signUpForm.password}
            secureTextEntry
            onChangeText={(text) => {
              setSignUpForm((prev)=> ({...prev, password : text}))
            }}
            label=""
            keyboardType="default"
          />
          <View style={styles.CtaBtnWrapper}>
            <CustomButton
              color={"#ff611d"}
              textStyle="#fff"
              leftIcon={false}
              title="Sign Up"
              style="default"
              onPressTouch={handleOnPress}
            />
          </View>
          <View style={styles.signInBtnDirector}>
            <Text style={styles.directingLine}>Already have an account?</Text>
            <Link style={styles.underlinedLink} href={'/(auth)/signIn'}>SignIn</Link>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

let styles = StyleSheet.create({
  eyboardWrapperv: {},
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
    flexDirection: "row"
  },
  underlinedLink: {
    fontSize: 12,
    fontWeight : 'bold',
    color: "#ff611d",
    textDecorationLine: "underline",
  },
   directingLine : {
    marginHorizontal : 4
  }

  //   container: {
  //   flex: 1,
  // },
});

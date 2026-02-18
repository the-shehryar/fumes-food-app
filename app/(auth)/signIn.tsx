import Logo from "@/assets/images/applogo.svg";
import GoogleIcon from "@/assets/images/google-icon.svg";
import { SignInForm } from "@/type";
import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
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
import { signIn } from "@/libs/appwrite";
import useAuthStore from "@/stores/auth.store";

export default function SignIn() {
  let [form, setForm] = useState<SignInForm>({ email: "", password: "" });
  //* Destructuring from state
  let { email, password } = form;
  let [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  let {fetchAuthenticatedUser} = useAuthStore()

  const signInUser = async () => {
    if (!email || !password)
    // showing toast message to inform user
      Platform.OS === "android"
        ? ToastAndroid.show(
            "Please provide all the required information",
            ToastAndroid.TOP,
          )
        : Alert.alert("Error", "Please provide right info");
        //* perfroming Sign In 
        await signIn({email, password})
        router.replace('/')
    try {
    } catch (error) {
      throw new Error(error as string);
    }
  };


  useEffect(()=> {
    fetchAuthenticatedUser()
  }, [])

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.signInWrapper}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View>
          <Logo style={styles.logoWrapper} />
          {/* <Image
            style={styles.logoWrapper}
            source={images.appLogo}
            resizeMode="contain"
          /> */}
          <CustomInput
            placeholder="Email"
            value={form.email}
            onChangeText={(text) => {
              setForm((prev) => ({ ...prev, email: text }));
            }}
            label=""
            keyboardType="default"
          />
          <CustomInput
            placeholder="Password"
            value={form.password}
            secureTextEntry
            onChangeText={(text) => {
              setForm((prev) => ({ ...prev, password: text }));
            }}
            label=""
            keyboardType="default"
          />
          <View style={styles.checkBoxWrapper}>
            {/* Add a checkbox here */}
            <Text style={styles.checkBoxText}>Remember Me</Text>
          </View>
          <View style={styles.CtaBtnWrapper}>
            <CustomButton
              color={"#ff611d"}
              textStyle="#fff"
              leftIcon={false}
              title="Sign In"
              style="default"
              onPressTouch={signInUser}
            />
          </View>
          <View style={styles.signUpBtnDirector}>
            <Text style={styles.directingLine}>Don't have an account?</Text>
            <Link style={styles.underlinedLink} href={"/signup"}>
              SignUp
            </Link>
          </View>
          {/* <View style={styles.seperatorWrapper}>
            <View style={styles.seperator}></View>
          </View> */}
          <CustomButton
            color={"#f5f5f5"}
            icon={
              <GoogleIcon
                style={{ marginHorizontal: 8 }}
                width={20}
                height={20}
              />
            }
            leftIcon={false}
            title="Try another way"
            textStyle="#000"
            style="big-filled"
            // value="googleAuth"
          />
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
  checkBoxWrapper: {
    width: "100%",
    height: "auto",
    paddingHorizontal: 40,
    justifyContent: "center",
    alignItems: "flex-end",
    marginVertical: 10,
  },
  checkBoxText: {
    fontSize: 12,
  },
  signUpBtnDirector: {
    width: "100%",
    height: "auto",
    marginVertical: 20,
    marginBottom: 40,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  underlinedLink: {
    fontSize: 12,
    color: "#ff611d",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  directingLine: {
    marginHorizontal: 4,
  },
  seperatorWrapper: {
    width: "100%",
    height: "auto",
    justifyContent: "center",
    alignItems: "center",
  },
  seperator: {
    width: "30%",
    height: 20,
    marginBottom: 50,
    borderBottomWidth: 2,
    borderBottomColor: "#f5f5f5",
  },
  //   container: {
  //   flex: 1,
  // },
});

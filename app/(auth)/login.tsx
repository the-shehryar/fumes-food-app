import Logo from "@/assets/images/applogo.svg";
import { router } from "expo-router";
import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import CustomButton from "../components/CustomButton";
import Feather from "@expo/vector-icons/Feather";
import AppleIcon from '@/assets/images/ic_round-apple.svg'
import GoogleIcon from '@/assets/images/google-icon.svg'
import EmailIconWhite from '@/assets/images/ic_outline-email.svg'






export default function SignIn() {

function handleEmailSignup (){
  router.push("/(auth)/signup");
}

  function handleEmailLogin() {
    router.push("/(auth)/signIn");
  }
  function handleAppleLogin() {
    router.push("/(auth)/signIn");
  }
  function handleGoogleLogin() {
    router.push("/(auth)/signIn");
  }
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.signInWrapper}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View>
          <Logo style={styles.logoWrapper} />
          <CustomButton
            color={"#000"}
            icon = {<AppleIcon style={{marginHorizontal : 8}} width={20} height={20}/>}
            leftIcon={true}
            title="Continue with Apple"
            textStyle="#fff"
            style="big-filled"
            onPressTouch={handleAppleLogin}
            // value="appleAuth"
          />
          <CustomButton
            color={"#f5f5f5"}
            icon = {<GoogleIcon style={{marginHorizontal : 8}} width={20} height={20}/>}
            leftIcon={true}
            title="Continue with Google"
            textStyle="#000"
            style="big-filled"
            onPressTouch={handleGoogleLogin}
            // value="googleAuth"
          />
          <CustomButton
            color={"#ff611d"}
            icon = {<EmailIconWhite style={{marginHorizontal : 8}} width={20} height={20}/>}
            leftIcon={true}
            title="Continue with Email"
            textStyle="#fff"
            style="big-filled"
            // value="emailAuth"
            onPressTouch={handleEmailLogin}
          />

          <View style={styles.CtaBtnWrapper}>
            <CustomButton
              color={"#0000009a"}
              leftIcon={false}
              textStyle="#fff"
              title="Sign In"
              style="default"
              onPressTouch={handleEmailLogin}
            />
            </View>
          <View style={styles.CtaBtnWrapper}>
            <CustomButton
              color={"#0000009a"}
              leftIcon={false}
              textStyle="#fff"
              title="Sign Up"
              style="default"
              onPressTouch={handleEmailSignup}
            />
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

  //   container: {
  //   flex: 1,
  // },
});

import Logo from "@/assets/images/applogo.svg";
import GoogleIcon from "@/assets/images/google-icon.svg";
import AppleIcon from "@/assets/images/ic_round-apple.svg";
import Colors from "@/constants/Colors";
import { OauthLogin, signIn } from "@/libs/appwrite";
import useAuthStore from "@/stores/auth.store";
import { SignInForm, User } from "@/types/type";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
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
import { OAuthProvider } from "react-native-appwrite";
import CustomButton from "../../components/CustomButton";
import CustomInput from "../../components/CustomInput";
let { WHITE, ORANGE, ORANGE_LIGHT, GRAY, GREEN, GREEN_LIGHT, BORDER, DARK } =
  Colors;

export default function SignIn() {
  let { user, setUser, isAuthenticated } = useAuthStore();
  let [form, setForm] = useState<SignInForm>({ email: "", password: "" });
  //* Destructuring from state
  let { email, password } = form;

  function handleEmailSignup() {
    router.push("/(auth)/signup");
  }
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

    let safeEmail = email.trim();
    let safePassword = password.trim();
    await signIn({ email: safeEmail, password: safePassword });
    router.replace("/");
    try {
    } catch (error) {
      throw new Error(error as string);
    }
  };
  function handleAppleLogin() {
    router.push("/(auth)/login");
  }
  async function handleGoogleLogin(provider: OAuthProvider) {
    let user = await OauthLogin(provider);
    console.log(user);
    if (user !== null) {
      isAuthenticated = true;
      setUser(user as User);
      router.push("/");
    } else {
      console.log("user cant do oauth");
    }
  }
  function handleSignUpRedirect() {
    router.replace("/(auth)/signup");
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
            icon={
              <AppleIcon
                style={{ marginHorizontal: 8 }}
                width={22}
                height={22}
              />
            }
            leftIcon={true}
            title="Continue with Apple"
            textStyle="#fff"
            style="big-filled"
            onPressTouch={handleAppleLogin}
            // value="appleAuth"
          />
          <CustomButton
            color={"#f5f5f5"}
            icon={
              <GoogleIcon
                style={{ marginHorizontal: 8 }}
                width={20}
                height={20}
              />
            }
            leftIcon={true}
            title="Continue with Google"
            textStyle="#000"
            style="big-filled"
            onPressTouch={() => handleGoogleLogin(OAuthProvider.Google)}
          />
          {/* <CustomButton
            color={"#ff611d"}
            icon = {<EmailIconWhite style={{marginHorizontal : 8}} width={20} height={20}/>}
            leftIcon={true}
            title="Continue with Email"
            textStyle="#fff"
            style="big-filled"
            onPressTouch={handleEmailLogin}
          /> */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or login with email</Text>
            <View style={styles.dividerLine} />
          </View>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View>
              {/* <Logo style={styles.logoWrapper} /> */}
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
                <Text style={styles.checkBoxText}>Forgot Password</Text>
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
              {/* <View style={styles.signUpBtnDirector}>
                <Text style={styles.directingLine}>Don't have an account?</Text>
                <Link style={styles.underlinedLink} href={"/signup"}>
                  SignUp ——{">"}
                </Link>
              </View> */}
              {/* <View style={styles.seperatorWrapper}>
            <View style={styles.seperator}></View>
          </View> */}
              <View style={styles.redirectButtonWrapper}>
                <CustomButton
                  color={"#ffffff"}
                  icon={<Feather name="user" size={24} color={"#000"} />}
                  leftIcon={false}
                  title="Don't have an account?"
                  textStyle="#000"
                  style="big-filled"
                  onPressTouch={handleSignUpRedirect}
                  // value="googleAuth"
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

let styles = StyleSheet.create({
  eyboardWrapperv: {},
  signInWrapper: {
    // flex : 1,
    position: "absolute",
    top: Dimensions.get("screen").height / 2.25 - 160,
    backgroundColor: WHITE,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    width: "100%",
    height:
      Dimensions.get("screen").height -
      Dimensions.get("screen").height / 2.25 +
      160,
    paddingTop: 48,
  },
  redirectButtonWrapper: {
    width: "100%",
    height: "auto",
    padding: 20,
    backgroundColor: WHITE,
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
    color: ORANGE,
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
    borderBottomColor: BORDER,
  },
  divider: {
    paddingHorizontal: 60,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    gap: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#eee",
  },
  dividerText: {
    fontSize: 12,
    color: GRAY,
  },
});

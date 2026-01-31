import { Slot } from "expo-router";
import {
    Dimensions,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {images} from "@/constants"; 
export default function _Layout() {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* <Text>Auth Page</Text> */}
      <ScrollView keyboardShouldPersistTaps="handled" style={styles.scrollViewStyles}>
        <View style={[{height : Dimensions.get('screen').height / 2.25}, styles.heroImageContainer]}>
            <ImageBackground style={styles.heroImage} source={images.sandwichBackground} resizeMode="stretch" />
        </View>

      </ScrollView>
      <Slot />
    </KeyboardAvoidingView>
  );
}


let styles = StyleSheet.create({
    scrollViewStyles :{
        height : Dimensions.get('screen').height / 2.25,
        backgroundColor : "#9e3131"
    },
    heroImageContainer : {
        flex : 1,
    },
    heroImage : {
        flex : 1
    }
})
import { Text, View, Button } from "react-native";
import { router } from "expo-router";

export default function SignUp() {
  return (
    <View>
      <Text>This is Sign Up screen</Text>
      <Button title="Sign In" onPress={() => router.push("/(auth)/signIn")} />
    </View>
  );
}

import { router } from "expo-router";
import { Button, Text, View } from "react-native";

export default function SignIn() {
  return (
    <View>
      <Text>This is Sign In screen</Text>
      <Button  title="Sign Up" onPress={() => router.push("/(auth)/signup")} />
    </View>
  );
}

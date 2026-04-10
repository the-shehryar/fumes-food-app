import { Redirect } from "expo-router";
import useAuthStore from "@/stores/auth.store";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const { isLoading, isAuthenticated } = useAuthStore();
  
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#F97316" />
      </View>
    );
  }

  return <Redirect href={isAuthenticated ? "/(tabs)" : "/(auth)/login"} />;
}
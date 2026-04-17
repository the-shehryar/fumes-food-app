import useAuthStore from "@/stores/auth.store";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  const { isAuthenticated, fetchAuthenticatedUser } = useAuthStore();

  useEffect(() => {
    fetchAuthenticatedUser();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="products/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="checkout/index" options={{ headerShown: false }} />
        <Stack.Screen name="orders/index" options={{ headerShown: false }} />
        {/* Static Screens */}
        <Stack.Screen
          name="statics/addresses"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="statics/personal" options={{ headerShown: false }} />
        <Stack.Screen name="statics/faqs" options={{ headerShown: false }} />
        <Stack.Screen
          name="statics/privacypolicy"
          options={{ headerShown: false }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}

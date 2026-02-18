import { account, getCurrentUser } from "@/libs/appwrite";
import { router, Stack, useRouter, useSegments } from "expo-router";
import { useActionState, useEffect, useState } from "react";
import { Models } from "react-native-appwrite";
// import "global.css"
import * as Sentry from '@sentry/react-native';
import useAuthStore from "@/stores/auth.store";


Sentry.init({
  dsn: 'https://f20c44a5c85f5ddc8a6f444735bfaf53@o4510852361093120.ingest.de.sentry.io/4510852387766352',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

export default Sentry.wrap(function RootLayout() {
  const {isLoading, user, isAuthenticated, fetchAuthenticatedUser} = useAuthStore()
  useEffect(() => {
    fetchAuthenticatedUser()
    console.log(`user from layout ${user}`)
  }, []);

  return (     
      !isAuthenticated ? (
        <Stack>
          <Stack.Screen name="(auth)"></Stack.Screen>
        </Stack>
      ) : (
        <Stack>
          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false }}
          ></Stack.Screen>
        </Stack>
      )
  );
});
import { account } from "@/libs/appwrite";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { Models } from "react-native-appwrite";
// import "global.css"
export const isAuthenticated = false;

export default function RootLayout() {
  let [userSession, setUserSession] =
    useState<Models.User<Models.Preferences> | null>(null);
  

 function RouterGuard({ children }: { children: React.ReactNode }) {
    let router = useRouter();
    let segment = useSegments()

    return <>{children}</>;
  }



  async function persistUser() {
    let session = await account.get();
    setUserSession(session);
  }

  useEffect(() => {
    persistUser();
  }, []);

  return (
      <RouterGuard>      
      {!isAuthenticated ? (
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
      )}
      </RouterGuard>
  );
}

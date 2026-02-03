import { account } from "@/libs/appwrite";
import AuthProvider, { useAuth } from "@/libs/auth-context";
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
    let {user, fetchingUser} = useAuth()


    useEffect(() => {
      let isAuthSection = segment[0] === '(auth)'
      let inSignUp = segment[0] === 'signup'

      if (user === null && !isAuthSection && !fetchingUser) {
        console.log('This block runs')
        router.replace("/(auth)/login");
      }
      else if(user && isAuthSection && !fetchingUser){
        console.log('everything is going good and user presists')
        router.replace('/')
        console.log(user)
      }
    }, [user]);

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
    <AuthProvider>
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
    </AuthProvider>
  );
}

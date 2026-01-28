import { Redirect, Stack } from "expo-router";
// import "global.css"

export default function RootLayout() {
  const isAuthenticated = false;
  if (!isAuthenticated){

    return <Stack>
      <Stack.Screen 
      name="(auth)"
      >
      </Stack.Screen>
    </Stack>;
  } else {
    return (
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        ></Stack.Screen>
      </Stack>
    );
  }
}

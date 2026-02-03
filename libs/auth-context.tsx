// import { AuthContextType } from "@/type";
import { AuthContextType } from "@/type";
import React, { createContext, useContext, useEffect, useState } from "react";
import { ToastAndroid } from "react-native";
import { ID, Models } from "react-native-appwrite";
import { account } from "./appwrite";
import { router } from "expo-router";

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  let [fetchingUser, setFetchingUser] = useState<boolean>(true);

  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(
    null,
  );

  async function signIn(email: string, password: string) {
    let authRequest = await account.createEmailPasswordSession({
      email,
      password,
    });
    let session = await account.get();
    setUser(session);
    ToastAndroid.show('Login Successful', ToastAndroid.LONG)
    return null;
  }
  async function signUp(name: string, email: string, password: string) {
    try {
      let session = await account.create({
        userId: ID.unique(),
        name,
        email,
        password,
      });
      ToastAndroid.show("Registeration Successful", ToastAndroid.LONG);
      return null;
    } catch (error) {
      if (error instanceof Error) {
        return error.message;
      }
    }
    return "Unexpected Error";
  }
  async function signOut() {
    try {
      await account.deleteSession({sessionId : "current"})
      setUser(null)

    }catch(error){
      console.log(error)
    }
  }

  async function requestUser() {
    try {
      let session = await account.get();
      setUser(session);
    } catch (error) {
      if (error) {
        console.log(error);
        setUser(null);
      }
    }
    setFetchingUser(false);
  }

  useEffect(() => {
    requestUser();
  }, [user]); //! check afterwards might raise a problem

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, fetchingUser,signOut }}>
      {children}
      {/* {isLoadingUser ? (
        <SafeAreaView
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text>Please Wait .. Loading....</Text>
        </SafeAreaView>
      ) : (
        children
      )} */}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be inside of the AuthProvider");
  }
  return context;
}

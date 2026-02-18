/* 

Normal typescript file where we connect with appwrite and export 
the variables so we can access in the entire app

Accounts is for users, Client is for Conncetion, TablesDB is the actual database instance

DATABASE_ID is the unqiue id of database in use
*/

import { CreateUserParams, SignInParams, User } from "@/type";
import { Alert, Platform, ToastAndroid } from "react-native";
import {
  Account,
  Avatars,
  Client,
  ID,
  Query,
  Storage,
  TablesDB,
} from "react-native-appwrite";




export const appwriteConfig = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
    platform: process.env.EXPO_PUBLIC_APPWRITE_PLATFROM_NAME!,
    databaseId: process.env.EXPO_PUBLIC_DATABASES_ID!,
    bucketId: process.env.EXPO_PUBLIC_BUCKET_ID!,
    userCollectionId: process.env.EXPO_PUBLIC_USER_COLLECtION_ID!,
    categoriesCollectionId: process.env.EXPO_PUBLIC_CATEGORIES_COLLECtION_ID!,
    menuCollectionId: process.env.EXPO_PUBLIC_MENU_COLLECtION_ID!,
    customizationsCollectionId: process.env.EXPO_PUBLIC_CUSTOMIZATIONS_COLLECtION_ID!,
    menuCustomizationsCollectionId: process.env.EXPO_PUBLIC_MENU_CUSTOMIZATIONS_COLLECtION_ID!
}


export const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!)
  .setPlatform(process.env.EXPO_PUBLIC_APPWRITE_PLATFROM_NAME!);

export const account = new Account(client);
export const databases = new TablesDB(client);
export const avatars = new Avatars(client);
export const storage = new Storage(client)
export const DATABASE_ID = process.env.EXPO_PUBLIC_DATABASES_ID!;

// let {fetchAuthenticatedUser} = useAuthStore()

export const createUser = async ({
  email,
  name,
  password,
}: CreateUserParams) => {
  try {
    //* Authentication Account

    const newUser = await account.create({
      userId: ID.unique(),
      name,
      email,
      password,
    });

    if (!newUser) return showToast("User creation failed");

    //* Avatar Creation
    let avatarUrl = avatars.getInitialsURL(name);

    //* Registering User in Databases
    const newUserData = await databases.createRow({
      databaseId: DATABASE_ID,
      tableId: "users",
      rowId: ID.unique(),
      data: {
        accountId: newUser.$id,
        email,
        password,
        name,
        avatarUrl: avatarUrl,
      },
    });
    console.log('DatabaseReply')
    console.log(`DatabaseReply : ${newUserData}`)
    //* Once user is created signIn again 
    await signIn({ email, password });

  } catch (error) {
    throw new Error(error as string);
  }
};

export const signIn = async ({ email, password }: SignInParams) => {
  try {
    let session = await account.createEmailPasswordSession({ email, password });
  } catch (error) {
    throw new Error(error as string);
  }
};

export let getCurrentUser = async () => {
  try {
    let currentAccount = await account.get();
    console.log(currentAccount.$id);
    if (!currentAccount) throw new Error("Can't get the account");
    let currentUser = await databases.listRows<User>({
      databaseId: DATABASE_ID,
      tableId: "users",
      queries: [Query.equal("accountId", currentAccount.$id)],
    });
    if (!currentUser) throw new Error("User does not exists");
    console.log(currentUser.rows);
    return currentUser.rows[0];
  } catch (error) {
    console.log(error);
    throw new Error(error as string);
  }
};

export const showToast = (message: string) => {
  if (Platform.OS === "android") {
    ToastAndroid.show(message, ToastAndroid.TOP);
  } else {
    // Alert works on both platforms, but looks different from an Android toast
    Alert.alert(message);
  }
};

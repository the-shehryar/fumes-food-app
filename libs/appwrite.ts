/* 

Normal typescript file where we connect with appwrite and export 
the variables so we can access in the entire app

Accounts is for users, Client is for Conncetion, TablesDB is the actual database instance

DATABASE_ID is the unqiue id of database in use
*/

import {
  CreateUserParams,
  GetMenuParams,
  GetTopRatedMenuParams,
  SignInParams,
  User,
} from "@/types/type";
import { makeRedirectUri } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { Alert, Platform, ToastAndroid } from "react-native";
import {
  Account,
  Avatars,
  Client,
  ID,
  OAuthProvider,
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
  userCollectionId: process.env.EXPO_PUBLIC_USER_COLLECTION_ID!,
  categoriesCollectionId: process.env.EXPO_PUBLIC_CATEGORIES_COLLECtION_ID!,
  menuCollectionId: process.env.EXPO_PUBLIC_MENU_COLLECtION_ID!,
  customizationsCollectionId:
    process.env.EXPO_PUBLIC_CUSTOMIZATIONS_COLLECtION_ID!,
  menuCustomizationsCollectionId:
    process.env.EXPO_PUBLIC_MENU_CUSTOMIZATIONS_COLLECtION_ID!,
  menuItemSizesCollectionId:
    process.env.EXPO_PUBLIC_MENU_ITEMSIZES_COLLECTION_ID!,
};

export const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!)
  .setPlatform(process.env.EXPO_PUBLIC_APPWRITE_PLATFROM_NAME!);

export const account = new Account(client);
export const databases = new TablesDB(client);
export const avatars = new Avatars(client);
export const storage = new Storage(client);
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

    //* Should not be saving password in database as i'm using appwrite for authentication
    //* and it will handle password security and hashing but for now i am just going to save email
    //* and name in database to fetch it later for user profile and other use cases

    const newUserData = await databases.createRow({
      databaseId: DATABASE_ID,
      tableId: "users",
      rowId: ID.unique(),
      data: {
        accountId: newUser.$id,
        email,
        name,
        avatarUrl: avatarUrl,
      },
    });
    console.log("DatabaseReply");
    console.log(`DatabaseReply : ${newUserData}`);
    //* Once user is created signIn again
    await signIn({ email, password });
  } catch (error) {
    throw new Error(error as string);
  }
};

export const signIn = async ({ email, password }: SignInParams) => {
  try {
    console.log("trying to signIn");
    let session = await account.createEmailPasswordSession({ email, password });
  } catch (error) {
    throw new Error(error as string);
  } finally {
    console.log("are you in?");
  }
};

export let getCurrentUser = async (oauth?: boolean) => {
  try {
    let currentAccount = await account.get();

    if (!currentAccount) throw new Error("Can't get the account");

    let userExist = await databases.listRows<User>({
      databaseId: DATABASE_ID,
      tableId: appwriteConfig.userCollectionId,
      queries: [Query.equal("accountId", currentAccount.$id)],
    });

    if (userExist.rows.length === 0 && oauth) {
      const newUser = await databases.createRow({
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.userCollectionId,
        rowId: ID.unique(),
        data: {
          accountId: currentAccount.$id,
          name: currentAccount.name,
          email: currentAccount.email,
          avatarUrl: `https://ui-avatars.com/api/?name=${currentAccount.name}&background=F97316&color=fff`,
        },
      });
      return newUser;
    }

    return (userExist.rows[0] as User) ?? null;
  } catch (error) {
    console.log(error);
    throw new Error(error as string);
  }
};

export let OauthLogin = async (provider: OAuthProvider) => {
  try {
    let deepLink = new URL(
      makeRedirectUri({
        scheme: `appwrite-callback-${appwriteConfig.projectId}`,
      }),
    );
    let scheme = `${deepLink.protocol}//`;

    // Login URL
    const loginUrl = await account.createOAuth2Token({
      provider: provider,
      success: `${deepLink}`,
      failure: `${deepLink}`,
    });
    console.log(loginUrl);
    if (!loginUrl) throw new Error("Failed to create OAuth session");

    const result = await WebBrowser.openAuthSessionAsync(`${loginUrl}`, scheme);

    // Extract credentials from OAuth redirect URL
    if (result.type !== "success")
      throw new Error("OAuth login failed or was cancelled");

    const url = new URL(result.url);
    const secret = url.searchParams.get("secret");
    const userId = url.searchParams.get("userId");

    // Create session with OAuth credentials

    if (userId && secret) {
      try {
        await account.deleteSession({ sessionId: "current" });
      } catch (error) {
        console.log(error);
      }

      let oauthUser = await account.createSession({
        userId,
        secret,
      });
      if (oauthUser) {
        console.log("successfully logged in with oauth");
        let user = await getCurrentUser(true);
        return user;
      } else {
        console.log("check credentials");
        return null;
      }
    }
  } catch (error) {
    console.log(error);
    return null;
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

export let getMenu1 = async () => {
  const menu = await databases.listRows({
    databaseId: DATABASE_ID,
    tableId: "menu",
  });
  return menu.rows;
};

export const getMenu = async ({ category, query }: GetMenuParams) => {
  try {
    const queries: string[] = [];

    if (category) queries.push(Query.equal("categories", category));
    if (query) queries.push(Query.search("name", query));

    const menus = await databases.listRows({
      databaseId: DATABASE_ID,
      tableId: appwriteConfig.menuCollectionId,
      queries,
    });

    return menus.rows;
  } catch (e) {
    throw new Error(e as string);
  }
};

export const getCategories = async () => {
  try {
    const categories = await databases.listRows({
      databaseId: DATABASE_ID,
      tableId: appwriteConfig.categoriesCollectionId,
    });

    return categories.rows;
  } catch (e) {
    throw new Error(e as string);
  }
};

export const getTopRatedMenu = async ({
  category,
  query,
  limit,
}: GetTopRatedMenuParams) => {
  try {
    console.log("fetching top rated");
    const menus = await databases.listRows({
      databaseId: DATABASE_ID,
      tableId: appwriteConfig.menuCollectionId,
      queries: [Query.orderDesc("rating"), Query.limit(limit)],
    });

    const menuWithCustomizations = await Promise.all(
      menus.rows.map(async (menuItem) => {
        const menuCustomizationTable = await databases.listRows({
          databaseId: DATABASE_ID,
          tableId: "menu_customizations",
          queries: [Query.equal("menu", menuItem.$id)], // Filter by menu_id
        });

        const customizations = await Promise.all(
          menuCustomizationTable.rows.map(async (junction) => {
            const customization = await databases.getRow({
              databaseId: DATABASE_ID,
              tableId: "customizations",
              rowId: junction.customizations,
            });

            // Return customization as you please like i want to have icon return a string that i can
            // recheck in front end to assign either a emoji or SVG icon
            // I have to seed data again to upload customization attribute
            return {
              name: customization.name,
              id: customization.$id,
              price: customization.price,
              icon: customization.icon,
              type: customization.type,
              checked: false,
            };
          }),
        );
        return {
          ...menuItem,
          customizations: customizations, // Array of customization objects as per liked structure
        };
      }),
    );

    return menuWithCustomizations;
  } catch (e) {
    throw new Error(e as string);
  }
};

export const getMenuWithCustomizations = async ({
  category,
  query,
}: GetMenuParams) => {
  try {
    let queries: string[] = []; //? List of strings

    if (category && category !== "")
      queries.push(Query.equal("categories", category));
    if (query && query !== "") queries.push(Query.search("name", query));
    // STEP 1: Fetch all menu items
    const menuResponse = await databases.listRows({
      databaseId: DATABASE_ID,
      tableId: "menu",
      queries,
    });

    const menuItems = menuResponse.rows;

    // For each menu item, fetch its customizations, collectively returning it in the end
    const menuWithCustomizations = await Promise.all(
      menuItems.map(async (menuItem) => {
        // Get MenuCustomization Table for this menu item
        // Every menu items will have multiple customizations as seeded in data.
        // in seed.ts, when we pass customization array whrn we create menuItem and register that menu item against that menu id
        // Like Garlic Bread customization while making Chicken Karahi Menu Item,
        // While creating customization we make a array that keep every created customization
        // while creating menu that array is matched with the customization passed whie creating menu item
        // if it matches we create a 2 values pair in menuCustomization Junction table
        // where menu is menuItem Id and customization is id from Customization table as Relationship is like
        // one MenuItem can have multiple customizations (as seeded via array we loop to create pair in menuCustomization Junction Table)
        const menuCustomizationTable = await databases.listRows({
          databaseId: DATABASE_ID,
          tableId: "menu_customizations",
          queries: [Query.equal("menu", menuItem.$id)], // Filter by menu_id
        });

        // After filtering you get an array of object, containing customization for specific menuItem.id
        // In this case we are fetching the entire menu so will be entire menu with customization
        // Although we can get one at a time as well
        // console.log(menuCustomizationTable.rows);
        // For each junction record (uploaded customization id into menu_customizations.customization), fetch the actual customization
        const customizations = await Promise.all(
          menuCustomizationTable.rows.map(async (junction) => {
            const customization = await databases.getRow({
              databaseId: DATABASE_ID,
              tableId: "customizations",
              rowId: junction.customizations,
            });

            // Return customization as you please like i want to have icon return a string that i can
            // recheck in front end to assign either a emoji or SVG icon
            // I have to seed data again to upload customization attribute
            return {
              name: customization.name,
              id: customization.$id,
              price: customization.price,
              icon: customization.icon,
              type: customization.type,
              checked: false,
            };
          }),
        );
        return {
          ...menuItem,
          customizations: customizations, // Array of customization objects as per liked structure
        };
      }),
    );
    // console.log('Weigo Sport')
    // console.log(menuWithCustomizations)
    return menuWithCustomizations;
  } catch (error) {
    console.error("Error fetching menu:", error);
    throw error;
  }
};

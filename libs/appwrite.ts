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
} from "@/type";
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
  customizationsCollectionId:
    process.env.EXPO_PUBLIC_CUSTOMIZATIONS_COLLECtION_ID!,
  menuCustomizationsCollectionId:
    process.env.EXPO_PUBLIC_MENU_CUSTOMIZATIONS_COLLECtION_ID!,
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
    const menus = await databases.listRows({
      databaseId: DATABASE_ID,
      tableId: appwriteConfig.menuCollectionId,
      queries: [Query.orderDesc("rating"), Query.limit(limit)],
    });
    return menus.rows;
  } catch (e) {
    throw new Error(e as string);
  }
};

export const getMenuWithCustomizations = async ({
  category,
  query,
}: GetMenuParams) => {
  try {
    let queries: string[] = []   //? List of strings 

    if (category) queries.push(Query.equal("categories", category));
    if (query) queries.push(Query.search("name", query));
    // STEP 1: Fetch all menu items
    const menuResponse = await databases.listRows({
      databaseId: DATABASE_ID,
      tableId: "menu",
      queries
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
              // icon: customization.icon,
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

// // ============================================
// // FUNCTION 2: Add a customization to a menu item
// // ============================================
// const addCustomizationToMenu = async (
//   menuId: string,
//   customizationId: string,
// ) => {
//   try {
//     await databases.createRow({
//       databaseId: DATABASE_ID,
//       tableId: "menu_customizations",
//       rowId: ID.unique(),
//       data: {
//         menu_id: menuId,
//         customization_id: customizationId,
//       },
//     });

//     console.log("Customization added to menu item");
//   } catch (error) {
//     console.error("Error adding customization:", error);
//   }
// };

// // ============================================
// // FUNCTION 3: Create new customization
// // ============================================
// const createCustomization = async (
//   name: string,
//   price: string,
//   icon: string,
// ) => {
//   try {
//     const response = await databases.createRow({
//       databaseId: DATABASE_ID,
//       tableId: "customizations",
//       rowId: ID.unique(),
//       data: {
//         name: name,
//         price: price,
//         icon: icon,
//       },
//     });

//     return response.$id; // Return the new customization ID
//   } catch (error) {
//     console.error("Error creating customization:", error);
//   }
// };

// // ============================================
// // FUNCTION 4: Create new menu item
// // ============================================
// const createMenuItem = async (
//   name: string,
//   price: string,
//   customizationIds = [],
// ) => {
//   try {
//     // Create the menu item
//     const menuItem = await databases.createRow({
//       databaseId: DATABASE_ID,
//       tableId: "menu",
//       rowId: ID.unique(),
//       data: {
//         name: name,
//         price: price,
//       },
//     });

//     // Link customizations to this menu item
//     for (const customizationId of customizationIds) {
//       await addCustomizationToMenu(menuItem.$id, customizationId);
//     }

//     return menuItem.$id;
//   } catch (error) {
//     console.error("Error creating menu item:", error);
//   }
// };

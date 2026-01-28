/* 

Normal typescript file where we connect with appwrite and export 
the variables so we can access in the entire app

Accounts is for users, Client is for Conncetion, TablesDB is the actual database instance

DATABASE_ID is the unqiue id of database in use
*/
import { Account, Client, TablesDB } from "react-native-appwrite";

export const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!)
  .setPlatform(process.env.EXPO_PUBLIC_APPWRITE_PLATFROM_NAME!);

export const account = new Account(client);
export const databases = new TablesDB(client);

export const DATABASE_ID = process.env.EXPO_PUBLIC_DATABASES_ID!;

/* 

Normal typescript file where we connect with appwrite and export 
the variables so we can access in the entire app

Accounts is for users, Client is for Conncetion, TablesDB is the actual database instance

DATABASE_ID is the unqiue id of database in use
*/

import { CreateUserParams, SignInParams } from "@/type";
import { Account, Avatars, Client, ID, Query, TablesDB } from "react-native-appwrite";

export const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!)
  .setPlatform(process.env.EXPO_PUBLIC_APPWRITE_PLATFROM_NAME!);

export const account = new Account(client);
export const databases = new TablesDB(client);
export const avatars = new Avatars(client);

export const DATABASE_ID = process.env.EXPO_PUBLIC_DATABASES_ID!;

export const createUser = async ({
  email,
  name,
  password,
}: CreateUserParams) => {
  try {
    const newUser = await account.create({
      userId: ID.unique(),
      name,
      email,
      password,
    });

    if(!newUser) throw new Error('Account creation failed')

      
  signIn({email, password})
  let avatarUrl = avatars.getInitialsURL(name)

  const newUserData = databases.createRow({
    databaseId : DATABASE_ID,
    tableId : 'users',
    rowId : ID.unique(),
    data : {
      accountId : newUser.$id,
      email, password, name,
      avatar : avatarUrl
    }
  })
  } catch (error) {
    throw new Error(error as string);
  }
};



export const signIn = async ({email, password} : SignInParams)=>{
  try {
    let session = await account.createEmailPasswordSession({email, password})
    
  } catch (error) {
    throw new Error(error as string)
  }
}

export let getCurrentUser = async ()=>{
  try {
    let currentAccount = await account.get();
    if(!currentAccount) throw new Error("Can't get the account")

    let currentUser  = await databases.listRows({
      databaseId : DATABASE_ID,
      tableId : "users",
      queries : [Query.equal('accountId', currentAccount.$id)]
    })
    if(!currentUser) throw new Error("User does not exists")

      return currentUser.rows[0]
  } catch (error) {
    throw new Error(error as string)
  }
}
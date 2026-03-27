import { MenuItem } from "@/types/type";
import AsyncStorage from "@react-native-async-storage/async-storage";

export let storeData = async (data: string) => {
  //? Should be stringfied array or object
  try {
    console.log('tring the localization')
    let localStorage = await AsyncStorage.setItem("mainMenu", data);
    console.log("Data was successfully localized");
  } catch (error) {
    console.log(error);
    console.log("Something Unexpected Occured");
  }
};

export let getStoredData = async (data: string): Promise<MenuItem[] | null> => {
  try {
    const localizedData = await AsyncStorage.getItem(data);
    if (localizedData !== null) {
      return JSON.parse(localizedData) as MenuItem[];
    }
    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

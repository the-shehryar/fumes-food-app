import { LocalSearchFilter, MenuItem } from "@/types/type";
import AsyncStorage from "@react-native-async-storage/async-storage";

export let storeData = async (data: string, key: string) => {
  //? Should be stringfied array or object
  try {
    console.log("tring the localization");
    let localStorage = await AsyncStorage.setItem(key, data);
    console.log("Data was successfully localized");
  } catch (error) {
    console.log(error);
    console.log("Something Unexpected Occured");
  }
};

export let getStoredData = async (
  key: string,
  options?: LocalSearchFilter,
): Promise<MenuItem[] | null> => {
  try {
    const localizedData = await AsyncStorage.getItem(key);
    if (localizedData !== null) {
      let searched = JSON.parse(localizedData) as MenuItem[];

      //? If there is criteria is passed
      
      if (Object.keys(options?.criteria ?? {}).length > 0) {
        searched.map((item) => {
          const filterKey = options?.filter as keyof typeof item;
          if(options?.criteria?.type === 'equals'){
            if (filterKey && item[filterKey] === options?.criteria?.value) {
              return item
            }
          }
        });
      }

      //? if there is any limit passed 
      if (options?.limit && options?.limit > 0) {
        return searched.slice(0, options.limit);
      }
      // console.log(searched)
      return searched;
    }
    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

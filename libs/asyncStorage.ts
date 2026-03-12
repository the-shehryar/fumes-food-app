import { GetMenuParams, MenuItem } from "@/type"
import AsyncStorage from "@react-native-async-storage/async-storage"


export let storeData = async (data : string) => {
    //? Should be stringfied array or object  
    try {
      let localStorage = await AsyncStorage.setItem('mainMenu' , data)
      console.log('Data was successfully localized')
    } catch (error) {
      console.log(error)
      console.log('Something Unexpected Occured')
    }
  }

export let getStoredData = async (data : string) : Promise<MenuItem[]> => {
    //? Should be stringfied array or object 
    let availableData = null 
    try {
      let localizedData = await AsyncStorage.getItem(data)
      if(localizedData !== null){
        availableData = await JSON.parse(localizedData)
      }else {
        availableData = null
      }
    } catch (error) {
      console.log(error)
      availableData = null
    }
    return availableData as MenuItem[];
  }
import { Models } from "react-native-appwrite";



export interface OfferStructure extends Models.Document {
    id  : string,
    name : string,
    price : number,
    items : string
}

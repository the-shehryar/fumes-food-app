import { create } from "zustand";

interface MiscStore {
  savedOrders : string,
  setSavedOrders : (value : string)=>void,  
  isLocalizedOrders: boolean;
  isLocalizingOrders : boolean;
  setIsLocalizedOrders : (value : boolean)=>void;
  setIsLocalizingOrders : (value : boolean)=>void;
}

let useMiscStore = create<MiscStore>((set) => ({
  isLocalizedOrders: false,
  isLocalizingOrders: false,
  savedOrders : '[]',
  setIsLocalizedOrders : (value)=>{
    set({isLocalizedOrders : value})
  },
  setIsLocalizingOrders : (value)=>{
    set({isLocalizingOrders : value})
  },
  setSavedOrders : (value) => {
    set({savedOrders : value})
  }
}));


export default useMiscStore;
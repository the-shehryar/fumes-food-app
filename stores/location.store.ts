import {create} from 'zustand'

type LocationState = {
    address : string;
    mocked : boolean,
    setAddress : (value:string) => void;
    setMocked: (value : boolean) => void;
}
 
const useLocationStore = create<LocationState>((set) => ({
    address : "Tap here for location",
    mocked : false,
    setMocked  : (value) => set({mocked : value}),
    setAddress : (value) => set({address : value})
}))

export default useLocationStore;
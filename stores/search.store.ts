import {create} from 'zustand'

type SearchState = {
    data : string;
    currentProduct : string,
    isSearching : boolean;
    setData : (value:string) => void;
    setCurrentProduct : (value:string) => void;
    setIsSearching : (value:boolean) => void;
}
 
const useSearchStore = create<SearchState>((set) => ({
    data : '',
    isSearching : false,
    currentProduct : '',
    setCurrentProduct : (value) => set({currentProduct : value}),
    setData : (value) => set({data : value}),
    setIsSearching : (value) => set({isSearching : value})
}))

export default useSearchStore;
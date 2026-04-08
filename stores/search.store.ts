import {create} from 'zustand'

type SearchState = {
    data : string;
    currentProduct : string,
    isSearching : boolean;
    zquery : string,
    zcategory : string,
    setData : (value:string) => void;
    setCurrentProduct : (value:string) => void;
    setIsSearching : (value:boolean) => void;
    setZQuery : (value : string) => void
    setZCategory : (value : string) => void
}
 
const useSearchStore = create<SearchState>((set) => ({
    data : '',
    isSearching : false,
    currentProduct : '',
    zquery : "",
    zcategory : "",
    setZQuery(value) {
        let safeValue = value.trim()
        set({zquery : safeValue})
    },
    setZCategory(value) {
        let safeValue = value.trim()
        set({zcategory : safeValue})
    },
    setCurrentProduct : (value) => set({currentProduct : value}),
    setData : (value) => set({data : value}),
    setIsSearching : (value) => set({isSearching : value})
}))

export default useSearchStore;
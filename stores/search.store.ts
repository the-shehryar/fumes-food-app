import {create} from 'zustand'

type SearchState = {
    data : string;
    isSearching : boolean;
    setData : (value:string) => void;
    setIsSearching : (value:boolean) => void;
}

const useSearchStore = create<SearchState>((set) => ({
    data : '',
    isSearching : false,
    setData : (value) => set({data : value}),
    setIsSearching : (value) => set({isSearching : value})
}))

export default useSearchStore;
import useSearchStore from "@/stores/search.store";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { useDebouncedCallback } from "use-debounce";
import CustomSearchInput from "./CustomIconInput";
const SearchBar = () => {
  const searchParams = useLocalSearchParams<{
    query?: string;
    category?: string;
  }>();
  const [query, setQuery] = useState(searchParams.query || "");
  const { setIsSearching } = useSearchStore();

 const debounceSearch = useDebouncedCallback((text: string) => {
  router.setParams({ 
    category: searchParams.category || "", 
    query: text  
  });
  if (!text) setIsSearching(false); 
}, 200);


  const handleSearch = (text: string) => {
    setQuery(text);
    debounceSearch(text);
    if (text) setIsSearching(true);
  };

  // console.log(`filter data ${JSON.stringify(filterData)}`);
  return (
    <CustomSearchInput
      icon
      label="Search"
      placeholder="Want something cheezzy??"
      //   onSubmitEditing={handleSearch}
      onChangeText={handleSearch}
      value={query}
      returnKeyType="search"
    />
  );
};

export default SearchBar;

let styles = StyleSheet.create({
  mainFlatListWrapper: {
    width: "100%",
    height: 50,
    paddingHorizontal: 20,
    overflowX: "hidden",
    marginVertical: 20,
  },
  categoriesBtn: {
    width: 100,
    height: 40,
    backgroundColor: "#d9d9d9",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
});

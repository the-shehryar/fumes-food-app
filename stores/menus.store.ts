import { MenuItem, Category, MenusState } from "@/types/type";
import { create } from "zustand";

const useMenusState = create<MenusState>((set) => ({
  isLocalized: false,
  menus: [],
  isCategoriesAvailable: false,
  categories : [],
  isLocalizing: false,
  updatingMenu: false,
  clearMenu: () => set({ menus: [] }),
  setUpdatingMenus: (value) => {
    set({ updatingMenu: value });
  },
  setMenus: (value) => {
    set({ menus: value });
  },
  setCategories: (value) => {
    set({ categories: value });
  },
  setIsLocalized: (value) => {
    set({ isLocalized: value });
  },
  setIsLocalizing: (value) => {
    set({ isLocalizing: value });
  },
  setIsCategoriesAvailable: (value) => {
    set({ isCategoriesAvailable: value });
  },
}));

export default useMenusState;

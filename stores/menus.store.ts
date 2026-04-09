import { MenuItem, Category } from "@/types/type";
import { create } from "zustand";

type MenusState = {
  menus: MenuItem[] | null;
  isLocalized: boolean;
  isLocalizing: boolean;
  updatingMenu: boolean;
  categories : Category[];
  isCategoriesAvailable: boolean;
  setIsCategoriesAvailable: (value: boolean) => void;
  setIsLocalized: (value: boolean) => void;
  setMenus: (value: MenuItem[] | null) => void;
  setCategories : (value : Category[]) => void
  setUpdatingMenus: (value: boolean) => void;
  setIsLocalizing: (value: boolean) => void;
  clearMenu: () => void;
};

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

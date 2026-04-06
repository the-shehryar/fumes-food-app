import { MenuItem } from "@/types/type";
import { create } from "zustand";

type MenusState = {
  menus: MenuItem[] | null;
  isLocalized: boolean;
  isLocalizing : boolean,
  updatingMenu: boolean;
  setIsLocalized: (value: boolean) => void;
  setMenus: (value: MenuItem[] | null) => void;
  setUpdatingMenus: (value: boolean) => void;
  setIsLocalizing  : (value : boolean) => void;
  clearMenu: () => void;
};

const useMenusState = create<MenusState>((set) => ({
  isLocalized: false,
  menus: [],
  isLocalizing : false,
  updatingMenu: false,
  clearMenu: () => set({ menus: [] }),
  setUpdatingMenus: (value) => {
    set({ updatingMenu: value });
  },
  setMenus: (value) => {
    set({ menus: value });
  },
  setIsLocalized: (value) => {
    set({ isLocalized: value });
  },
  setIsLocalizing : (value) => {
    set({isLocalizing : value})
  }
}));

export default useMenusState;

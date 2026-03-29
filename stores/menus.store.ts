import { MenuItem } from "@/types/type";
import { create } from "zustand";

type MenusState = {
  menus: MenuItem[] | null;
  isLocalized: boolean;
  updatingMenu: boolean;
  setIsLocalized: (value: boolean) => void;
  setMenus: (value: MenuItem[] | null) => void;
  setUpdatingMenus: (value: boolean) => void;
  clearMenu: () => void;
};

const useMenusState = create<MenusState>((set) => ({
  isLocalized: false,
  menus: [],
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
}));

export default useMenusState;

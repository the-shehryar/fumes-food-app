import { AddressAppwrite } from "@/types/type";
import { create } from "zustand";

type PreferencesState = {
  userAddresses: AddressAppwrite[];
  setUserAddresses: (value: AddressAppwrite[]) => void;
};

const usePreferencesStore = create<PreferencesState>((set) => ({
  userAddresses: [],
  setUserAddresses: (value: AddressAppwrite[]) =>
    set(() => ({userAddresses : value })),
}));

export default usePreferencesStore;

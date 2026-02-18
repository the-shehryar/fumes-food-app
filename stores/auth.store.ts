import { getCurrentUser, showToast } from "@/libs/appwrite";
import { User } from "@/type";
import { create } from "zustand";

type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;

  setIsAuthenticated: (value: boolean) => void;
  setUser: (user: User | null) => void;
  setLoading: (value: boolean) => void;

  fetchAuthenticatedUser: () => Promise<void>;
};

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isLoading: true,
  user: null,

  setIsAuthenticated: (value) => set({ isAuthenticated: value }),

  setUser: (value) => {
    set({ user: value });
  },

  setLoading: (value) => {
    set({ isLoading: value });
  },

  fetchAuthenticatedUser: async () => {
    set({ isLoading: true });
    try {
      let userState = await getCurrentUser();
      console.log('working from authStore')
      console.log(userState)
      userState
        ? set({ isAuthenticated: true, user: userState as User })
        : set({ isAuthenticated: false, user: null });

        console.log(`logger ${userState}`)
    } catch (error) {
      console.log('cant set the user')
      console.log(error)
      set({ isLoading: false, user: null })
      showToast('Please Try Signup if no account')
    }finally {
      set({isLoading : false})
    }
  },
}));


export default useAuthStore;
import { create } from "zustand";

interface SafepayState {
  tracker: string | null;
  clientSecret: string | null;
  deviceDataCollectionJWT: string | null;
  deviceDataCollectionURL: string | null;
  isLoading: boolean;

  setTrackerData: (data: {
    tracker: string;
    clientSecret: string;
    deviceDataCollectionJWT: string;
    deviceDataCollectionURL: string;
  }) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

const useSafepayStore = create<SafepayState>((set) => ({
  tracker: null,
  clientSecret: null,
  deviceDataCollectionJWT: null,
  deviceDataCollectionURL: null,
  isLoading: false,

  setTrackerData: (data) => set(data),
  setLoading: (value) => set({ isLoading: value }),
  reset: () =>
    set({
      tracker: null,
      clientSecret: null,
      deviceDataCollectionJWT: null,
      deviceDataCollectionURL: null,
      isLoading: false,
    }),
}));

export default useSafepayStore;

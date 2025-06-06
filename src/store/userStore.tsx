import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { mmkvStorage } from "./storage";
type CustomeLocation = {
  latitude: number;
  longitude: number;
  address: string;
} | null;

interface UserStoreProps {
  user: any;
  location: CustomeLocation;
  outOfRange: boolean;
  setUser: (data: any) => void;
  setOutOfRange: (data: boolean) => void;
  setLocation: (data: CustomeLocation) => void;
  clearData: () => void;
}

export const useUserStore = create<UserStoreProps>()(
  persist(
    (set) => ({
      user: null,
      location: null,
      outOfRange: false,
      setUser: (data) => set({ user: data }),
      setLocation: (data) => set({ location: data }),
      setOutOfRange: (data) => set({ outOfRange: data }),
      clearData: () => set({ user: null, location: null, outOfRange: false }),
    }),
    {
      name: "user-store", //it key to mmkv storage
      partialize: (state) => ({ user: state.user }),
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);

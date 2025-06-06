import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { mmkvStorage } from "./storage";
type CustomeLocation = {
  latitude: number;
  longitude: number;
  address: string;
  heading: number;
} | null;

interface RiderStoreProp {
  user: any;
  location: CustomeLocation;
  onDuty: boolean;
  setUser: (data: any) => void;
  setOnDuty: (data: boolean) => void;
  setLocation: (data: CustomeLocation) => void;
  clearRiderData: () => void;
}

export const useRiderStore = create<RiderStoreProp>()(
  persist(
    (set) => ({
      user: null,
      location: null,
      onDuty: false,
      setUser: (data) => set({ user: data }),
      setLocation: (data) => set({ location: data }),
      setOnDuty: (data) => set({ onDuty: data }),
      clearRiderData: () => set({ user: null, location: null, onDuty: false }),
    }),
    {
      name: "rider-store", //it key to mmkv storage
      partialize: (state) => ({ user: state.user }),
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);

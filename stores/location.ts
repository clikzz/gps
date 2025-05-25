import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Position = {
  latitude: number;
  longitude: number;
  timestamp: number;
};

type LocationStore = {
  position: Position | null;
  setPosition: (pos: Position) => void;
  resetPosition: () => void;
};

export const useLocationStore = create<LocationStore>()(
  persist(
    (set) => ({
      position: null,
      setPosition: (pos) => set({ position: pos }),
      resetPosition: () => set({ position: null })
    }),
    {
      name: 'location-storage',
      partialize: (state) => ({ position: state.position })
    }
  )
);
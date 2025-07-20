import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Pet } from "@/types/pet";

type activePetStore = {
  activePet: Pet | null;
  setActivePet: (pet: Pet) => void;
  resetActivePet: () => void;
  clearStorage: () => void;
};

export const useActivePet = create<activePetStore>()(
  persist(
    (set) => ({
      activePet: null,
      setActivePet: (pet) => set({ activePet: pet }),
      resetActivePet: () => set({ activePet: null }),
      clearStorage: () => {
        set({ activePet: null });
        localStorage.removeItem("active-pet-storage");
      },
    }),
    {
      name: "active-pet-storage",
      partialize: (state) => ({ activePet: state.activePet }),
    }
  )
);

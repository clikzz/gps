import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Pets as Pet } from "@prisma/client";

type activePetStore = {
  activePet: Pet | null;
  setActivePet: (pet: Pet) => void;
  resetActivePet: () => void;
};

export const useActivePet = create<activePetStore>()(
  persist(
    (set) => ({
      activePet: null,
      setActivePet: (pet) => set({ activePet: pet }),
      resetActivePet: () => set({ activePet: null }),
    }),
    {
      name: "active-pet-storage",
      partialize: (state) => ({ activePet: state.activePet }),
    }
  )
);

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Vaccination } from "@/types/vaccination";
import { Medication } from "@/types/medication";
import { DoseEntry } from "@/types/doseEntry";

interface HealthResume {
  medications: Medication[];
  vaccinations: Vaccination[];
  nextDoses: DoseEntry[];
  setHealthResume: (
    resume: Omit<HealthResume, "setHealthResume" | "setNextDoses">
  ) => void;
  setNextDoses: (nextDoses: DoseEntry[]) => void;
}

export const useHealth = create<HealthResume>()(
  persist(
    (set) => ({
      medications: [],
      vaccinations: [],
      nextDoses: [],
      setHealthResume: (resume) => set({ ...resume }),
      setNextDoses: (nextDoses) => set({ nextDoses }),
    }),
    {
      name: "health-storage",
      partialize: (state) => ({
        medications: state.medications,
        vaccinations: state.vaccinations,
        nextDoses: state.nextDoses,
      }),
    }
  )
);

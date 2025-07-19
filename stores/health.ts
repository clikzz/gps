import { create } from "zustand";

interface Medication {
  id: number;
  pet_id: number;
  name: string;
  dose: string;
  duration: string;
  start_date: string;
  next_dose_date?: string;
  send?: boolean;
  notes?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

interface Vaccination {
  id: number;
  pet_id: number;
  name: string;
  type?: string;
  application_date: string;
  next_dose_date?: string;
  send?: boolean;
  notes?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

interface NextDose {
  global_id: string;
  entry_type: string;
  name: string;
  pet_id: number;
  next_dose_date: string;
}

interface HealthState {
  medications: Medication[];
  vaccinations: Vaccination[];
  nextDoses: NextDose[];
  isLoading: boolean;
  error: string | null;
}

interface HealthActions {
  setHealthResume: (data: {
    medications: Medication[];
    vaccinations: Vaccination[];
    nextDoses: NextDose[];
  }) => void;
  addMedication: (medication: any) => Promise<void>;
  updateMedication: (medication: any) => Promise<void>;
  deleteMedication: (id: number) => Promise<void>;
  addVaccination: (vaccination: any) => Promise<void>;
  updateVaccination: (vaccination: any) => Promise<void>;
  deleteVaccination: (id: number) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  refreshHealthData: () => Promise<void>;
}

export const useHealth = create<HealthState & HealthActions>((set, get) => ({
  medications: [],
  vaccinations: [],
  nextDoses: [],
  isLoading: false,
  error: null,

  setHealthResume: (data) => {
    set({
      medications: data.medications,
      vaccinations: data.vaccinations,
      nextDoses: data.nextDoses,
    });
  },

  addMedication: async (medicationData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/health/medications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(medicationData),
      });

      if (!response.ok) {
        throw new Error("Error al agregar medicamento");
      }

      const newMedication = await response.json();
      set((state) => ({
        medications: [...state.medications, newMedication],
        isLoading: false,
      }));

      get().refreshHealthData();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "An error occurred",
        isLoading: false,
      });
      throw error;
    }
  },

  updateMedication: async (medicationData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(
        `/api/health/medications/${medicationData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(medicationData),
        }
      );

      if (!response.ok) {
        throw new Error("Error al actualizar medicamento");
      }

      const updatedMedication = await response.json();
      set((state) => ({
        medications: state.medications.map((med) =>
          med.id === updatedMedication.id ? updatedMedication : med
        ),
        isLoading: false,
      }));

      get().refreshHealthData();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "An error occurred",
        isLoading: false,
      });
      throw error;
    }
  },

  deleteMedication: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/health/medications/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar medicamento");
      }

      set((state) => ({
        medications: state.medications.filter((med) => med.id !== id),
        isLoading: false,
      }));

      get().refreshHealthData();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "An error occurred",
        isLoading: false,
      });
      throw error;
    }
  },

  addVaccination: async (vaccinationData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/health/vaccinations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(vaccinationData),
      });

      if (!response.ok) {
        throw new Error("Error al agregar vacuna");
      }

      const newVaccination = await response.json();
      set((state) => ({
        vaccinations: [...state.vaccinations, newVaccination],
        isLoading: false,
      }));

      get().refreshHealthData();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "An error occurred",
        isLoading: false,
      });
      throw error;
    }
  },

  updateVaccination: async (vaccinationData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(
        `/api/health/vaccinations/${vaccinationData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(vaccinationData),
        }
      );

      if (!response.ok) {
        throw new Error("Error al actualizar vacuna");
      }

      const updatedVaccination = await response.json();
      set((state) => ({
        vaccinations: state.vaccinations.map((vac) =>
          vac.id === updatedVaccination.id ? updatedVaccination : vac
        ),
        isLoading: false,
      }));

      get().refreshHealthData();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "An error occurred",
        isLoading: false,
      });
      throw error;
    }
  },

  deleteVaccination: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/health/vaccinations/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar vacuna");
      }

      set((state) => ({
        vaccinations: state.vaccinations.filter((vac) => vac.id !== id),
        isLoading: false,
      }));

      get().refreshHealthData();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "An error occurred",
        isLoading: false,
      });
      throw error;
    }
  },

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  refreshHealthData: async () => {
    try {
      const response = await fetch("/api/health");
      if (!response.ok) {
        throw new Error("Error al obtener datos de salud");
      }
      const data = await response.json();
      get().setHealthResume(data);
    } catch (error) {
      console.error("Error refreshing health data:", error);
    }
  },
}));

import { useHealth } from "@/stores/health";

export const handleGetHealth = async () => {
  const setHealthResume = useHealth.getState().setHealthResume;
  try {
    const response = await fetch(`/api/health`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error fetching next doses");
    }

    const data = await response.json();

    setHealthResume({
      medications: data.medications,
      vaccinations: data.vaccinations,
      nextDoses: data.nextDoses,
    });

    return data;
  } catch (error) {
    console.error("Failed to fetch next doses:", error);
    throw error;
  }
};

import { authenticateUser } from "@/server/middlewares/auth.middleware";
import { getMedications } from "@/server/services/medication.service";
import { getVaccinations } from "@/server/services/vaccination.service";

export async function GET(req: Request) {
  try {
    const user = await authenticateUser(req);
    if (user instanceof Response) return user;

    const medications = await getMedications(user.id);
    const vaccinations = await getVaccinations(user.id);

    const transformedMedications = medications.map((med) => ({
      ...med,
      id: Number(med.id),
      pet_id: Number(med.pet_id),
      entry_type: "medication",
      global_id: `medication-${med.id}`,
    }));

    const transformedVaccinations = vaccinations.map((vac) => ({
      ...vac,
      id: Number(vac.id),
      pet_id: Number(vac.pet_id),
      entry_type: "vaccination",
      global_id: `vaccination-${vac.id}`,
    }));

    const nextDoses = [
      ...transformedMedications,
      ...transformedVaccinations,
    ].filter(
      (item) =>
        item.active && item.next_dose_date && item.next_dose_date > new Date()
    );

    console.log("Next doses:", nextDoses);

    return new Response(
      JSON.stringify({
        medications: transformedMedications,
        vaccinations: transformedVaccinations,
        nextDoses,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching health data:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

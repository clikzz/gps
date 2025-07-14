import { authenticateUser } from "@/server/middlewares/auth.middleware";
import {
  fetchMedications,
  updateMedication,
} from "@/server/controllers/medication.controller";

export async function PUT(req: Request) {
  const user = await authenticateUser(req);
  if (user instanceof Response) return user;

  const medication = await req.json();
  const id = medication.id;

  if (!medication || !id) {
    return new Response(JSON.stringify({ error: "Invalid medication data" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const parsedMedication = {
    ...medication,
    start_date: medication.start_date
      ? new Date(medication.start_date)
      : undefined,
    next_dose_date: medication.next_dose_date
      ? new Date(medication.next_dose_date)
      : undefined,
  };

  return updateMedication(id, parsedMedication);
}

export async function GET(req: Request) {
  const user = await authenticateUser(req);
  if (user instanceof Response) return user;

  const url = new URL(req.url);
  const id = parseInt(url.searchParams.get("id") || "");

  if (!id) {
    return new Response(JSON.stringify({ error: "Invalid medication ID" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  return fetchMedications(id);
}

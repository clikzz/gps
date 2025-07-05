import {
  fetchMedications as getMedications,
  addMedication as createMedication,
} from "@/server/controllers/medication.controller";
import { authenticateUser } from "@/server/middlewares/auth.middleware";

export async function GET(req: Request) {
  const user = await authenticateUser(req);
  if (user instanceof Response) return user;

  return getMedications(parseInt(user.id));
}

export async function POST(req: Request) {
  const user = await authenticateUser(req);
  if (user instanceof Response) return user;

  const medication = await req.json();
  const pet_id = medication.pet_id;

  if (!medication || !medication.name) {
    return new Response(JSON.stringify({ error: "Invalid medication data" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  return createMedication(pet_id, medication);
}

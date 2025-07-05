import { authenticateUser } from "@/server/middlewares/auth.middleware";
import {
  getMedicationById,
  updateMedicationById,
} from "@/server/services/medication.service";

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

  return updateMedicationById(id, medication);
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

  return getMedicationById(id);
}

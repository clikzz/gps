import {
  getVaccinations,
  addVaccination as createVaccination,
  updateVaccination,
  removeVaccination,
} from "@/server/controllers/vaccination.controller";
import { authenticateUser } from "@/server/middlewares/auth.middleware";

export async function GET(req: Request) {
  const user = await authenticateUser(req);
  if (user instanceof Response) return user;

  return getVaccinations(user.id);
}

export async function POST(req: Request) {
  const user = await authenticateUser(req);
  if (user instanceof Response) return user;

  const vaccination = await req.json();
  const pet_id = vaccination.pet_id;

  if (!vaccination || !vaccination.name) {
    return new Response(JSON.stringify({ error: "Invalid vaccination data" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  return createVaccination(pet_id, vaccination);
}

export async function PUT(req: Request) {
  const user = await authenticateUser(req);
  if (user instanceof Response) return user;

  const vaccination = await req.json();
  const vaccinationId = vaccination.id;

  if (!vaccination || !vaccination.name || !vaccinationId) {
    return new Response(JSON.stringify({ error: "Invalid vaccination data" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  return updateVaccination(vaccinationId, vaccination);
}

export async function DELETE(req: Request) {
  const user = await authenticateUser(req);
  if (user instanceof Response) return user;

  const url = new URL(req.url);
  const vaccinationId = url.searchParams.get("id");

  if (!vaccinationId) {
    return new Response(JSON.stringify({ error: "Invalid vaccination ID" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  return removeVaccination(parseInt(vaccinationId));
}

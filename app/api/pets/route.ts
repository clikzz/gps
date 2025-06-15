import {
  fetchPets,
  addPet,
  fetchPetById,
  updatePetById,
} from "@/server/controllers/pets.controller";
import { authenticateUser } from "@/server/middlewares/auth.middleware";
import exp from "constants";

export async function GET(req: Request) {
  const user = await authenticateUser(req);
  if (user instanceof Response) return user;

  const url = new URL(req.url);
  const mode = url.searchParams.get("mode") || "all";
  if (mode === "all") {
    return fetchPets(user.id);
  }
  if (mode === "id") {
    return fetchPetById(url.searchParams.get("id") || "");
  }

  return new Response(JSON.stringify({ error: "Invalid mode" }), {
    status: 400,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req: Request) {
  const user = await authenticateUser(req);
  if (user instanceof Response) return user;

  const pet = await req.json();

  if (!pet) {
    return new Response(JSON.stringify({ error: "Invalid pet data" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  return addPet({
    user,
    pet,
  });
}

export async function PUT(req: Request) {
  const user = await authenticateUser(req);
  if (user instanceof Response) return user;

  const pet = await req.json();

  if (!pet || !pet.id) {
    return new Response(JSON.stringify({ error: "Invalid pet data" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  return updatePetById(pet.id, pet);
}

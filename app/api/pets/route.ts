import { fetchPets, addPet } from "@/server/controllers/petsController";
import { authenticateUser } from "@/server/middlewares/authMiddleware";

// GET all pets
export async function GET(req: Request) {
  const user = await authenticateUser(req);
  if (user instanceof Response) return user;
  return fetchPets(user.id);
}

// POST a new pet
export async function POST(req: Request) {
  const user = await authenticateUser(req);
  if (user instanceof Response) return user;
  const body = await req.json();
  const { name, species } = body;
  return addPet({
    user,
    name,
    species,
  });
}

import {
  fetchPetById,
  updatePetById,
} from "@/server/controllers/petsController";
import { authenticateUser } from "@/server/middlewares/authMiddleware";

// GET a pet by ID
export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const user = await authenticateUser(req);
  if (user instanceof Response) return user;
  const petId = params.id;
  return fetchPetById(petId);
}

// PUT to update a pet by ID
export async function PUT(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const user = await authenticateUser(req);
  if (user instanceof Response) return user;
  const petId = params.id;
  const body = await req.json();
  return updatePetById(petId, body);
}

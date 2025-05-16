import {
  fetchUserProfile,
  modifyUserProfile,
} from "@/server/controllers/userProfileController";
import { authenticateUser } from "@/server/middlewares/authMiddleware";

export async function GET(req: Request) {
  const user = await authenticateUser(req);
  if (user instanceof Response) return user;

  return fetchUserProfile(user.id);
}

export async function POST(req: Request) {
  const user = await authenticateUser(req);
  if (user instanceof Response) return user;

  const body = await req.json();
  const { name, email, avatar_url } = body;

  return modifyUserProfile(user.id, { name, email, avatar_url });
}

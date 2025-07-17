import {
  fetchUserProfile,
  modifyUserProfile,
} from "@/server/controllers/userprofile.controller";
import { authenticateUser } from "@/server/middlewares/auth.middleware";

export async function GET(req: Request) {
  const user = await authenticateUser(req);
  if (user instanceof Response) return user;

  return fetchUserProfile(user.id);
}

export async function POST(req: Request) {
  const user = await authenticateUser(req);
  if (user instanceof Response) return user;

  const body = await req.json();
  const { name, email, avatar_url, selectedBadgeIds } = body;

  return modifyUserProfile(user.id, { name, email, avatar_url, selectedBadgeIds });
}

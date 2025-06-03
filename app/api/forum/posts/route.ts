import { addPost } from "@/server/controllers/forumController";
import { authenticateUser } from "@/server/middlewares/authMiddleware";

export async function POST(req: Request) {
  const user = await authenticateUser(req);
  if (user instanceof Response) return user;
  return addPost(req, user.id);
}
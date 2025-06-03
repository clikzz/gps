import { fetchTopics, addTopic } from "@/server/controllers/forumController";
import { authenticateUser } from "@/server/middlewares/authMiddleware";

export async function GET(req: Request) {
  return fetchTopics();
}

export async function POST(req: Request) {
  const user = await authenticateUser(req);
  if (user instanceof Response) return user;
  return addTopic(req, user.id);
}
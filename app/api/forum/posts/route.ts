import { fetchPosts, addPost, enforceForumAccess } from "@/server/controllers/forum.controller";
import { authenticateUser } from "@/server/middlewares/auth.middleware"


export async function GET(req: Request) {
  const auth = await authenticateUser(req)
  if (auth instanceof Response) return auth

  const blocked = await enforceForumAccess(auth)
  if (blocked) return blocked    

  return fetchPosts(req)
}

export async function POST(req: Request) {
  const auth = await authenticateUser(req)
  if (auth instanceof Response) return auth

  const blocked = await enforceForumAccess(auth)
  if (blocked) return blocked

  return addPost(req)
}
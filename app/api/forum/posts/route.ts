import { fetchPosts, addPost } from "@/server/controllers/forumController";
export async function GET(req: Request) {
  return fetchPosts(req);
}
export async function POST(req: Request) {
  return addPost(req);
}
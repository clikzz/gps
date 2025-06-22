import { fetchPosts, addPost } from "@/server/controllers/forum.controller";

export async function GET(req: Request) {
  return fetchPosts(req);
}

export async function POST(req: Request) {
  return addPost(req);
}
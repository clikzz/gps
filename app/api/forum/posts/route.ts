import { fetchPosts, addPost, editPost, removePost } from "@/server/controllers/forum.controller";

export async function GET(req: Request) {
  return fetchPosts(req);
}

export async function POST(req: Request) {
  return addPost(req);
}

export async function PATCH(req: Request) {
  return editPost(req);
}

export async function DELETE(req: Request) {
  return removePost(req);
}
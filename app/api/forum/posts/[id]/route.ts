import { editOwnPost, removeOwnPost } from "@/server/controllers/forum.controller";

export async function PATCH(req: Request) {
  return await editOwnPost(req);
}

export async function DELETE(req: Request) {
  return await removeOwnPost(req);
}

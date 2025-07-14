import { editPostHandler, deletePostHandler } from "@/server/controllers/forum.controller";

export async function PATCH(req: Request) {
  return await editPostHandler(req);
}

export async function DELETE(req: Request) {
  return await deletePostHandler(req);
}

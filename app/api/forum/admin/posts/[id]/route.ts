import { deleteAnyPostHandler } from "@/server/controllers/forum.controller";

export async function DELETE(req: Request) {
  return deleteAnyPostHandler(req);
}

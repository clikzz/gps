import { deleteAnyTopicHandler } from "@/server/controllers/forum.controller";

export async function DELETE(req: Request) {
  return deleteAnyTopicHandler(req);
}
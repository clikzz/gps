import { editTopicHandler, deleteTopicHandler } from "@/server/controllers/forum.controller";

export async function PATCH(req: Request) {
  return await editTopicHandler(req);
}

export async function DELETE(req: Request) {
  return await deleteTopicHandler(req);
}


import { editOwnTopic, removeOwnTopic } from "@/server/controllers/forum.controller";

export async function PATCH(req: Request) {
  return await editOwnTopic(req);
}

export async function DELETE(req: Request) {
  return await removeOwnTopic(req);
}

import { lockTopicHandler } from "@/server/controllers/forum.controller";

export async function PATCH(req: Request) {
  return lockTopicHandler(req);
}

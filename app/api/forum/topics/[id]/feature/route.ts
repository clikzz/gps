import { featureTopicHandler } from "@/server/controllers/forum.controller";

export async function PATCH(req: Request) {
  return featureTopicHandler(req);
}
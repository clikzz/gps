import { fetchTopics, addTopic, removeTopic, editTopic} from "@/server/controllers/forum.controller";

export async function GET(req: Request) {
  return fetchTopics(req);
}

export async function POST(req: Request) {
  return addTopic(req);
}

export async function PATCH(req: Request) {
  return editTopic(req);
}

export async function DELETE(req: Request) {
  return removeTopic(req);
}
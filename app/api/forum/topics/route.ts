import { fetchTopics, addTopic } from "@/server/controllers/forumController";

export async function GET(req: Request) {
  return fetchTopics(req);
}

export async function POST(req: Request) {
  return addTopic(req);
}
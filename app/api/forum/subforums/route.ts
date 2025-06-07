import { fetchSubforums } from "@/server/controllers/forumController";

export async function GET() {
  return fetchSubforums();
}
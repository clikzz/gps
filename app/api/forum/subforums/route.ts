import { fetchSubforums } from "@/server/controllers/forum.controller";

export async function GET() {
  return fetchSubforums();
}
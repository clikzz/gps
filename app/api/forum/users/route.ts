import { fetchUsers } from "@/server/controllers/forum.controller";

export async function GET() {
  return fetchUsers();
}

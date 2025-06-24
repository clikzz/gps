import { addModerator, removeModerator } from "@/server/controllers/forum.controller";

export async function PATCH(req: Request) {
  return addModerator(req);
}
export async function DELETE(req: Request) {
  return removeModerator(req);
}

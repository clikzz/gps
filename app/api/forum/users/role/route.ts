import { changeUserRoleHandler } from "@/server/controllers/forum.controller"

export async function PATCH(req: Request) {
  return changeUserRoleHandler(req)
}

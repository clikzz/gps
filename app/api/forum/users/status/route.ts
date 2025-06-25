import { NextResponse } from "next/server"
import { authenticateUser, ensureModerator } from "@/server/middlewares/auth.middleware"
import { updateUserStatus } from "@/server/services/forum.service"

export async function PATCH(req: Request) {
  const auth = await authenticateUser(req)
  if (auth instanceof Response) return auth

  try {
    ensureModerator(auth)
  } catch {
    return NextResponse.json({ error: "No tienes permisos" }, { status: 403 })
  }

  const { targetUserId, status } = await req.json() as {
    targetUserId: string
    status: "ACTIVE" | "SUSPENDED" | "BANNED"
  }

  try {
    await updateUserStatus(auth.id, targetUserId, status)
    return NextResponse.json(null, { status: 204 })
  } catch (err: any) {
    const msg = err.message === "CANNOT_MODIFY_ADMIN"
      ? "No puedes modificar al administrador"
      : err.message === "FORBIDDEN_MODERATOR"
        ? "No tienes permisos"
        : "Error interno"
    return NextResponse.json({ error: msg }, { status: 400 })
  }
}

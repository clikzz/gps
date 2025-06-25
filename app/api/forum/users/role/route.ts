import { NextResponse } from "next/server"
import { authenticateUser, ensureAdmin } from "@/server/middlewares/auth.middleware"
import { updateUserRole } from "@/server/services/forum.service"

export async function PATCH(req: Request) {
  const auth = await authenticateUser(req)
  if (auth instanceof Response) return auth

  try {
    ensureAdmin(auth)
  } catch {
    return NextResponse.json({ error: "No tienes permisos" }, { status: 403 })
  }

  const { targetUserId, role } = await req.json() as {
    targetUserId: string
    role: "MODERATOR" | "USER"
  }

  try {
    await updateUserRole(auth.id, targetUserId, role)
    return NextResponse.json(null, { status: 204 })
  } catch (err: any) {
    const msg = err.message === "CANNOT_MODIFY_ADMIN"
      ? "No puedes modificar al administrador"
      : err.message === "FORBIDDEN_ADMIN"
        ? "No tienes permisos"
        : "Error interno"
    return NextResponse.json({ error: msg }, { status: 400 })
  }
}

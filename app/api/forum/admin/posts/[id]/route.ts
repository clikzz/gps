import { NextResponse } from "next/server"
import { authenticateUser } from "@/server/middlewares/auth.middleware"
import {
  updateOwnPost,
  deleteOwnPost,
  updateAnyPost,
  deleteAnyPost
} from "@/server/services/forum.service"
import { editPostSchema } from "@/server/validations/forum.validation"

export async function PATCH(req: Request) {
  const auth = await authenticateUser(req)
  if (auth instanceof Response) return auth

  const postId = Number(new URL(req.url).pathname.split("/").pop())
  if (isNaN(postId)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 })
  }

  const { content } = editPostSchema.parse(await req.json())

  if (auth.role === "MODERATOR" || auth.role === "ADMIN") {
    await updateAnyPost(auth.id, postId, content)
    return NextResponse.json(null, { status: 204 })
  }
  
  const result = await updateOwnPost(auth.id, postId, content)
  if (result.count === 0) {
    return NextResponse.json(
      { error: "No tienes permiso o mensaje no existe" },
      { status: 403 }
    )
  }
  return NextResponse.json(null, { status: 204 })
}

export async function DELETE(req: Request) {
  const auth = await authenticateUser(req)
  if (auth instanceof Response) return auth

  const postId = Number(new URL(req.url).pathname.split("/").pop())
  if (isNaN(postId)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 })
  }

  if (auth.role === "ADMIN") {
    await deleteAnyPost(postId)
    return NextResponse.json(null, { status: 204 })
  }

  const result = await deleteOwnPost(auth.id, postId)
  if (result.count === 0) {
    return NextResponse.json(
      { error: "No tienes permiso o mensaje no existe" },
      { status: 403 }
    )
  }
  return NextResponse.json(null, { status: 204 })
}

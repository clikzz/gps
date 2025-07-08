import prisma from "@/lib/db"
import { NextResponse } from "next/server"
import { authenticateUser } from "@/server/middlewares/auth.middleware"
import { changeUserStatusHandler } from "@/server/controllers/forum.controller"

export async function PATCH(req: Request) {
  return changeUserStatusHandler(req)
}

export async function GET(req: Request) {
  const auth = await authenticateUser(req)
  if (auth instanceof Response) {
    return auth
  }

  const profile = await prisma.users.findUnique({
    where: { id: auth.id },
    select: { status: true, suspensionUntil: true },
  })

  return NextResponse.json(profile)
}
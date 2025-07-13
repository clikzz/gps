import { authenticateUser } from "@/server/middlewares/auth.middleware"
import prisma from "@/lib/db"

export async function GET(req: Request) {
  const auth = await authenticateUser(req)
  if (auth instanceof Response) return auth

  const u = await prisma.users.findUnique({
    where: { id: auth.id },
    select: {
      status: true,
      banReason: true,
      banExpires: true
    },
  })

  return new Response(JSON.stringify(u), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  })
}

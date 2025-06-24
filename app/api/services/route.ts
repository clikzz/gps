import { fetchServices, addService } from "@/server/controllers/service.controller"
import { authenticateUser } from "@/server/middlewares/auth.middleware"
import { createServiceSchema } from "@/server/validations/service.validation"

export async function GET(req: Request) {
  const user = await authenticateUser(req)
  if (user instanceof Response) return user

  const { searchParams } = new URL(req.url)
  const filters = {
    latitude: searchParams.get("latitude"),
    longitude: searchParams.get("longitude"),
    radius: searchParams.get("radius"),
    category: searchParams.get("category"),
  }

  return fetchServices(filters)
}

export async function POST(req: Request) {
  const user = await authenticateUser(req)
  if (user instanceof Response) return user

  const body = await req.json()

  try {
    const validatedData = createServiceSchema.parse(body)
    return addService({ service: validatedData })
  } catch (error: any) {
    if (error.name === "ZodError") {
      return new Response(JSON.stringify({ error: "Datos inválidos", details: error.errors }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    return new Response(JSON.stringify({ error: "Error interno del servidor" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

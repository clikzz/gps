import { fetchServices, addService, updateServiceById, deleteServiceById } from "@/server/controllers/service.controller"
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

export async function PUT(req: Request) {
  const user = await authenticateUser(req)
  if (user instanceof Response) return user

  const { searchParams } = new URL(req.url)
  const serviceId = searchParams.get("id")

  if (!serviceId) {
    return new Response(JSON.stringify({ error: "ID del servicio es requerido" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }

  const body = await req.json()

  try {
    const partialSchema = createServiceSchema.partial()
    const validatedData = partialSchema.parse(body)

    return updateServiceById(serviceId, validatedData)
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

export async function DELETE(req: Request) {
  const user = await authenticateUser(req)
  if (user instanceof Response) return user

  if (user.role !== "ADMIN") {
    return new Response(JSON.stringify({ error: "No tienes permisos para eliminar servicios. Solo los administradores pueden realizar esta acción." }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    })
  }

  const { searchParams } = new URL(req.url)
  const serviceId = searchParams.get("id")

  if (!serviceId) {
    return new Response(JSON.stringify({ error: "ID del servicio es requerido" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }

  try {
    return deleteServiceById(serviceId)
  } catch (error: any) {
    return new Response(JSON.stringify({ error: "Error interno del servidor" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

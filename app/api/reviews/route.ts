import { fetchReviewsByServiceId, addReview } from "@/server/controllers/reviews.controller"
import { authenticateUser } from "@/server/middlewares/auth.middleware"
import { createReviewSchema, getReviewsSchema } from "@/server/validations/reviews.validation"

export async function GET(req: Request) {
  const user = await authenticateUser(req)
  if (user instanceof Response) return user

  const { searchParams } = new URL(req.url)
  const service_id = searchParams.get("service_id")

  if (!service_id) {
    return new Response(JSON.stringify({ error: "service_id es requerido" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }

  try {
    getReviewsSchema.parse({ service_id })
    return fetchReviewsByServiceId({ service_id })
  } catch (error: any) {
    if (error.name === "ZodError") {
      return new Response(JSON.stringify({ error: "Parámetros inválidos", details: error.errors }), {
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

export async function POST(req: Request) {
  const user = await authenticateUser(req)
  if (user instanceof Response) return user

  const body = await req.json()

  try {
    const validatedData = createReviewSchema.parse(body)
    return addReview({ review: { ...validatedData, comment: validatedData.comment ?? undefined }, userId: user.id })
  } catch (error: any) {
    if (error.name === "ZodError") {
      return new Response(JSON.stringify({ error: "Datos inválidos", details: error.errors }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    if (error.message === "Ya has dejado una reseña para este servicio") {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    if (error.message === "El servicio no existe") {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      })
    }

    return new Response(JSON.stringify({ error: "Error interno del servidor" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

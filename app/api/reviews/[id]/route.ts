import { updateReviewById, deleteReviewById } from "@/server/controllers/reviews.controller"
import { authenticateUser } from "@/server/middlewares/auth.middleware"
import { updateReviewSchema } from "@/server/validations/reviews.validation"

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const user = await authenticateUser(req)
  if (user instanceof Response) return user

  const { id } = params
  const body = await req.json()

  try {
    const validatedData = updateReviewSchema.parse(body)
    return updateReviewById({ 
      reviewId: id, 
      userId: user.id, 
      data: validatedData 
    })
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

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const user = await authenticateUser(req)
  if (user instanceof Response) return user

  const { id } = params

  try {
    return deleteReviewById({ 
      reviewId: id, 
      userId: user.id 
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: "Error interno del servidor" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

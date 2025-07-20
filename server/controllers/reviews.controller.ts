import { createReview, getReviewsByServiceId, updateReview, deleteReview } from "../services/reviews.service"
import type { GetReviewsInput, UpdateReviewInput } from "../validations/reviews.validation"

const serializeBigInt = (obj: any): any => {
  if (obj === null || obj === undefined) {
    return obj
  }

  if (typeof obj === 'bigint') {
    return obj.toString()
  }

  if (obj instanceof Date) {
    return obj.toISOString()
  }

  if (Array.isArray(obj)) {
    return obj.map(item => serializeBigInt(item))
  }

  if (typeof obj === 'object' && obj.constructor === Object) {
    const serialized: any = {}
    for (const [key, value] of Object.entries(obj)) {
      serialized[key] = serializeBigInt(value)
    }
    return serialized
  }

  return obj
}

export const fetchReviewsByServiceId = async (filters: { service_id: string }) => {
  try {
    const parsedFilters: GetReviewsInput = {
      service_id: filters.service_id,
    }

    const reviews = await getReviewsByServiceId(parsedFilters)

    const serializedReviews = serializeBigInt(reviews)

    return new Response(JSON.stringify(serializedReviews), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error en fetchReviewsByServiceId:", error)
    return new Response(JSON.stringify({ error: "Error interno del servidor" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

export const addReview = async ({
  review,
  userId,
}: {
  review: {
    service_id: string
    rating: number
    comment?: string
  }
  userId: string
}) => {
  try {
    const newReview = await createReview({
      ...review,
      user_id: userId,
    })

    const serializedReview = serializeBigInt(newReview)

    return new Response(JSON.stringify(serializedReview), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error en addReview:", error)
    return new Response(JSON.stringify({ error: "Error interno del servidor" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

export const updateReviewById = async ({
  reviewId,
  userId,
  data,
}: {
  reviewId: string
  userId: string
  data: UpdateReviewInput
}) => {
  try {
    const updatedReview = await updateReview(reviewId, userId, data)

    const serializedReview = serializeBigInt(updatedReview)

    return new Response(JSON.stringify(serializedReview), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error: any) {
    console.error("Error en updateReviewById:", error)
    
    if (error.message === "Reseña no encontrada o no tienes permisos para editarla") {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      })
    }

    return new Response(JSON.stringify({ error: "Error interno del servidor" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

export const deleteReviewById = async ({
  reviewId,
  userId,
}: {
  reviewId: string
  userId: string
}) => {
  try {
    await deleteReview(reviewId, userId)

    return new Response(JSON.stringify({ message: "Reseña eliminada correctamente" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error: any) {
    console.error("Error en deleteReviewById:", error)
    
    if (error.message === "Reseña no encontrada o no tienes permisos para eliminarla") {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      })
    }

    return new Response(JSON.stringify({ error: "Error interno del servidor" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

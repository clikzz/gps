import { createReview, getReviewsByServiceId } from "../services/reviews.service"
import type { GetReviewsInput } from "../validations/reviews.validation"

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

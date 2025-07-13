import prisma from "@/lib/db"
import type { CreateReviewInput, GetReviewsInput } from "../validations/reviews.validation"

export const createReview = async (data: CreateReviewInput & { user_id: string }) => {
  const existingReview = await prisma.reviews.findFirst({
    where: {
      service_id: BigInt(data.service_id),
      user_id: data.user_id,
    },
  })

  if (existingReview) {
    throw new Error("Ya has dejado una reseña para este servicio")
  }

  const service = await prisma.services.findUnique({
    where: { id: BigInt(data.service_id) },
  })

  if (!service) {
    throw new Error("El servicio no existe")
  }

  return await prisma.reviews.create({
    data: {
      service_id: BigInt(data.service_id),
      user_id: data.user_id,
      rating: data.rating,
      comment: data.comment || null,
    },
    include: {
      users: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar_url: true,
        },
      },
    },
  })
}

export const getReviewsByServiceId = async (filters: GetReviewsInput) => {
  const reviews = await prisma.reviews.findMany({
    where: {
      service_id: BigInt(filters.service_id),
    },
    include: {
      users: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar_url: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  })

  return reviews
}

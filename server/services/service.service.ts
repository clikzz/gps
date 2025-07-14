import prisma from "@/lib/db"
import type { CreateServiceInput, GetServicesInput } from "../validations/service.validation"
import type { Services } from "@prisma/client"

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export const createService = async (data: CreateServiceInput) => {
  return await prisma.services.create({
    data: {
      name: data.name,
      latitude: data.latitude,
      longitude: data.longitude,
      description: data.description,
      phone: data.phone,
      categories: data.categories,
    },
    include: {
      Reviews: true,
    },
  })
}

export const getServices = async (filters: GetServicesInput) => {
  const services = await prisma.services.findMany({
    include: {
      Reviews: true,
    },
  })

  let filteredServices = services

  if (filters.latitude && filters.longitude && filters.radius) {
    filteredServices = services.filter((service: Services) => {
      const distance = calculateDistance(filters.latitude!, filters.longitude!, service.latitude, service.longitude)
      return distance <= filters.radius!
    })
  }

  if (filters.category) {
    filteredServices = filteredServices.filter((service: Services) =>
      service.categories.includes(filters.category!)
    )
  }

  return filteredServices
}

export const getServiceById = async (serviceId: string) => {
  return await prisma.services.findUnique({
    where: { id: BigInt(serviceId) },
    include: {
      Reviews: true,
    },
  })
}

export const updateService = async (serviceId: string, data: Partial<CreateServiceInput>) => {
  return await prisma.services.update({
    where: { id: BigInt(serviceId) },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.latitude && { latitude: data.latitude }),
      ...(data.longitude && { longitude: data.longitude }),
      ...(data.description && { description: data.description }),
      ...(data.categories && { categories: data.categories }),
      ...(data.phone && { phone: data.phone }),
    },
    include: {
      Reviews: true,
    },
  })
}

export const deleteService = async (serviceId: string) => {
  return await prisma.services.delete({
    where: { id: BigInt(serviceId) },
  })
}

import { createService, getServices, getServiceById, updateService, deleteService } from "../services/service.service"
import type { Services as Service } from "@prisma/client"
import type { ServiceCategory } from "../validations/service.validation"

export const fetchServices = async (filters: {
  latitude?: string | null
  longitude?: string | null
  radius?: string | null
  category?: string | null
}) => {
  const parsedFilters = {
    latitude: filters.latitude ? Number.parseFloat(filters.latitude) : undefined,
    longitude: filters.longitude ? Number.parseFloat(filters.longitude) : undefined,
    radius: filters.radius ? Number.parseFloat(filters.radius) : undefined,
    category: filters.category as ServiceCategory | undefined,
  }

  const services = await getServices(parsedFilters)

  const formattedServices = services.map((service: Service) => ({
    ...service,
    id: service.id.toString(),
  }))

  return new Response(JSON.stringify(formattedServices), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  })
}

export const addService = async ({
  service,
}: {
  service: {
    name: string
    latitude: number
    longitude: number
    description: string
    categories: ServiceCategory[] 
    phone: string
  }
}) => {
  const newService = await createService(service)

  const formattedService = {
    ...newService,
    id: newService.id.toString(),
  }

  return new Response(JSON.stringify(formattedService), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  })
}

export const fetchServiceById = async (serviceId: string) => {
  const service = await getServiceById(serviceId)

  if (!service) {
    return new Response(JSON.stringify({ error: "Service not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    })
  }

  const serviceFetched = {
    ...service,
    id: service.id.toString(),
  }

  return new Response(JSON.stringify(serviceFetched), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  })
}

export const updateServiceById = async (
  serviceId: string,
  {
    name,
    latitude,
    longitude,
    description,
    categories,
    phone,
  }: {
    name?: string
    latitude?: number
    longitude?: number
    description?: string
    categories?: ServiceCategory[]
    phone?: string
  },
) => {
  const service = await getServiceById(serviceId)

  if (!service) {
    return new Response(JSON.stringify({ error: "Service not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    })
  }

  const updatedService = await updateService(serviceId, {
    name,
    latitude,
    longitude,
    description,
    categories,
    phone,
  })

  if (!updatedService) {
    return new Response(JSON.stringify({ error: "Failed to update service" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }

  const formattedService = {
    ...updatedService,
    id: updatedService.id.toString(),
  }

  return new Response(JSON.stringify(formattedService), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  })
}

export const deleteServiceById = async (serviceId: string) => {
  const service = await getServiceById(serviceId)

  if (!service) {
    return new Response(JSON.stringify({ error: "Service not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    })
  }

  await deleteService(serviceId)

  return new Response(JSON.stringify({ message: "Service deleted successfully" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  })
}

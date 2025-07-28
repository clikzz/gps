"use client"

import { useForm } from "@tanstack/react-form"
import { useState } from "react"
import { toast } from "sonner"
import { 
  Service, 
  EditServiceFormData, 
  EditServiceFormInput, 
  editServiceFormSchema 
} from "@/types/service"

interface UseEditServiceFormProps {
  service: Service
  onSuccess?: () => void
}

export const useEditServiceForm = ({ service, onSuccess }: UseEditServiceFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm({
    defaultValues: {
      name: service.name || "",
      categories: service.categories || [],
      description: service.description || "",
      latitude: service.latitude,
      longitude: service.longitude,
      phone: service.phone || "",
    } as EditServiceFormData,
    onSubmit: async ({ value }) => {
      setIsSubmitting(true)
      try {
        const response = await fetch(`/api/services?id=${service.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: value.name,
            categories: value.categories, 
            description: value.description,
            latitude: value.latitude,
            longitude: value.longitude,
            phone: value.phone,
          }),
        })

        if (response.ok) {
          toast.success("Servicio actualizado correctamente")
          onSuccess?.()
        } else {
          const error = await response.json()
          toast.error(error.error || "Error al actualizar el servicio")
        }
      } catch (error) {
        console.error("Error:", error)
        toast.error("Error al actualizar el servicio")
      } finally {
        setIsSubmitting(false)
      }
    },
  })

  return {
    form,
    isSubmitting,
  }
}

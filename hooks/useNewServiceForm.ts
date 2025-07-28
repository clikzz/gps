"use client"

import { useForm } from "@tanstack/react-form"
import { useState } from "react"
import { toast } from "sonner"
import {
  NewServiceFormData,
  NewServiceFormInput,
  newServiceFormSchema,
  type ServiceCategory
} from "@/types/service"

interface UseNewServiceFormProps {
  onSuccess?: () => void
}

export const useNewServiceForm = ({ onSuccess }: UseNewServiceFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm({
    defaultValues: {
      name: "",
      categories: [] as ServiceCategory[],
      description: "",
      latitude: 0,
      longitude: 0,
      phone: "",
    } as NewServiceFormData,
    onSubmit: async ({ value }) => {
      setIsSubmitting(true)
      try {
        const response = await fetch("/api/services", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: value.name,
            categories: Array.isArray(value.categories) ? value.categories : [],
            description: value.description,
            latitude: value.latitude,
            longitude: value.longitude,
            phone: value.phone,
          }),
        })

        if (response.ok) {
          const newService = await response.json()
          toast.success("Servicio creado exitosamente")
          form.reset()
          onSuccess?.()
        } else {
          const error = await response.json()
          toast.error(error.error || "Error al crear el servicio")
        }
      } catch (error) {
        console.error("Error:", error)
        toast.error("Error al crear el servicio")
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

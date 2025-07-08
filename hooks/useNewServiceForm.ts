import { useForm } from "@tanstack/react-form"
import { toast } from "sonner"

export interface ServiceFormData {
  name: string
  latitude: string
  longitude: string
  description: string
  category: string
}

interface UseNewServiceFormProps {
  onSuccess?: () => void
}

export const useNewServiceForm = ({ onSuccess }: UseNewServiceFormProps) => {
  const form = useForm({
    defaultValues: {
      name: "",
      latitude: "",
      longitude: "",
      description: "",
      category: "",
    } as ServiceFormData,
    onSubmit: async ({ value }) => {
      await handleSubmit(value)
    },
  })

  const handleSubmit = async (values: ServiceFormData) => {
    try {
      const formattedValues = {
        ...values,
        latitude: Number.parseFloat(values.latitude),
        longitude: Number.parseFloat(values.longitude),
      }

      const response = await fetch("/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedValues),
      })

      if (!response.ok) {
        console.log(response)

        const error = await response.json()
        console.log("Error creating service:", error)

        toast.error(error.error || "Error al crear el servicio")
        return
      }

      const newService = await response.json()

      form.reset()

      toast.success("Servicio creado con éxito")
      onSuccess?.()
    } catch (error) {
      console.error("Error creating service:", error)

      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Error inesperado al crear el servicio")
      }
    }
  }

  return {
    form,
    isSubmitting: form.state.isSubmitting,
  }
}

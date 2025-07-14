import { useForm } from "@tanstack/react-form"
import { zodValidator } from "@tanstack/zod-form-adapter"
import { toast } from "sonner"
import { useUserProfile } from "@/stores/userProfile"

interface UseNewReviewFormProps {
  serviceId: string
  onSuccess: () => void
}

export const useNewReviewForm = ({ serviceId, onSuccess }: UseNewReviewFormProps) => {
  const { user } = useUserProfile()

  const form = useForm({
    defaultValues: {
      rating: 0,
      comment: "",
    },
    onSubmit: async ({ value }) => {
      if (!user) {
        toast.error("Debes iniciar sesión para dejar una reseña")
        return
      }

      try {
        const response = await fetch("/api/reviews", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            service_id: serviceId,
            rating: value.rating,
            comment: value.comment || null,
          }),
        })

        if (response.ok) {
          toast.success("Reseña enviada exitosamente")
          form.reset()
          onSuccess()
        } else {
          const errorData = await response.json()
          toast.error(errorData.error || "Error al enviar la reseña")
        }
      } catch (error) {
        console.error("Error submitting review:", error)
        toast.error("Error al enviar la reseña")
      }
    },
  })

  return {
    form,
    isSubmitting: form.state.isSubmitting,
  }
}

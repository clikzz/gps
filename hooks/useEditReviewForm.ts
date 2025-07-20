import { useForm } from "@tanstack/react-form"
import { toast } from "sonner"
import { useUserProfile } from "@/stores/userProfile"

interface UseEditReviewFormProps {
  reviewId: string
  initialRating: number
  initialComment?: string
  onSuccess?: () => void
}

export const useEditReviewForm = ({ 
  reviewId, 
  initialRating, 
  initialComment, 
  onSuccess 
}: UseEditReviewFormProps) => {
  const { user } = useUserProfile()

  const form = useForm({
    defaultValues: {
      rating: initialRating,
      comment: initialComment || "",
    },
    onSubmit: async ({ value }) => {
      if (!user) {
        toast.error("Debes iniciar sesión para editar tu reseña")
        return
      }

      try {
        const response = await fetch(`/api/reviews/${reviewId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            rating: value.rating,
            comment: value.comment || null,
          }),
        })

        if (response.ok) {
          toast.success("Reseña actualizada correctamente")
          onSuccess?.()
        } else {
          const errorData = await response.json()
          toast.error(errorData.error || "Error al actualizar la reseña")
        }
      } catch (error) {
        console.error("Error:", error)
        toast.error("Error al actualizar la reseña")
      }
    },
  })

  return form
}

interface UseDeleteReviewProps {
  reviewId: string
  onSuccess?: () => void
}

export const useDeleteReview = ({ reviewId, onSuccess }: UseDeleteReviewProps) => {
  const { user } = useUserProfile()

  const deleteReview = async () => {
    if (!user) {
      toast.error("Debes iniciar sesión")
      return
    }

    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Reseña eliminada correctamente")
        onSuccess?.()
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || "Error al eliminar la reseña")
      }
    } catch (error) {
      console.error("Error:", error)
      toast.error("Error al eliminar la reseña")
    }
  }

  return { deleteReview }
}

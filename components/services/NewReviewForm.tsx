"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { useNewReviewForm } from "@/hooks/useNewReviewForm"
import { StarRatingField, TextAreaField } from "./ReviewFormField"
import { Check, Star } from "lucide-react"

interface NewReviewFormProps {
  serviceId: string
  serviceName: string
  onReviewCreated: () => void
}

const NewReviewForm: React.FC<NewReviewFormProps> = ({ serviceId, serviceName, onReviewCreated }) => {
  const reviewForm = useNewReviewForm({
    serviceId,
    onSuccess: () => {
      onReviewCreated()
    },
  })

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
            <Star className="w-3 h-3 text-white" />
          </div>
          <span className="text-sm font-medium text-yellow-800">Nueva reseña</span>
        </div>
        <p className="text-xs text-gray-600">Comparte tu experiencia con {serviceName}</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          reviewForm.form.handleSubmit()
        }}
        className="space-y-4"
      >
        {/* Rating */}
        <reviewForm.form.Field
          name="rating"
          validators={{
            onChange: ({ value }) => {
              if (!value || value === 0) {
                return "Por favor selecciona una calificación"
              }
              return undefined
            },
          }}
        >
          {(field) => <StarRatingField field={field} label="Calificación" required />}
        </reviewForm.form.Field>

        {/* Comment */}
        <reviewForm.form.Field name="comment">
          {(field) => (
            <TextAreaField
              field={field}
              label="Comentario (opcional)"
              placeholder="Cuéntanos sobre tu experiencia..."
              maxLength={500}
            />
          )}
        </reviewForm.form.Field>

        <Button type="submit" className="w-full" disabled={reviewForm.isSubmitting}>
          {reviewForm.isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Enviando reseña...
            </>
          ) : (
            <div className="flex items-center">
              <Check className="w-4 h-4 mr-2" />
              Enviar reseña
            </div>
          )}
        </Button>
      </form>
    </div>
  )
}

export default NewReviewForm

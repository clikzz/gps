"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { useEditReviewForm } from "@/hooks/useEditReviewForm"
import { StarRatingField, TextAreaField } from "./ReviewFormField"
import { Edit2, Check } from "lucide-react"

interface EditReviewDrawerProps {
  reviewId: string
  initialRating: number
  initialComment?: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onReviewUpdated: () => void
}

const EditReviewDrawer: React.FC<EditReviewDrawerProps> = ({ 
  reviewId, 
  initialRating, 
  initialComment, 
  open, 
  onOpenChange, 
  onReviewUpdated 
}) => {
  const reviewForm = useEditReviewForm({
    reviewId,
    initialRating,
    initialComment,
    onSuccess: onReviewUpdated,
  })

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-lg">
          <DrawerHeader className="flex flex-col items-center justify-center">
            <DrawerTitle className="text-center">Editar Reseña</DrawerTitle>
            <DrawerDescription className="text-center">Modifica tu reseña para este servicio</DrawerDescription>
          </DrawerHeader>
          <div className="overflow-y-auto max-h-[60vh] px-4">
            <div className="space-y-4">
              {/* Header */}
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <Edit2 className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm font-medium text-blue-800">Editar reseña</span>
                </div>
                <p className="text-xs text-gray-600">Actualiza tu experiencia</p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  reviewForm.handleSubmit()
                }}
                className="space-y-4"
              >
                {/* Rating */}
                <reviewForm.Field
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
                </reviewForm.Field>

                {/* Comment */}
                <reviewForm.Field name="comment">
                  {(field) => (
                    <TextAreaField
                      field={field}
                      label="Comentario (opcional)"
                      placeholder="Cuéntanos sobre tu experiencia..."
                      maxLength={500}
                    />
                  )}
                </reviewForm.Field>

                <reviewForm.Subscribe
                  selector={(state) => [state.canSubmit, state.isSubmitting]}
                >
                  {([canSubmit, isSubmitting]) => (
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={!canSubmit || isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Actualizando reseña...
                        </>
                      ) : (
                        <div className="flex items-center">
                          <Check className="w-4 h-4 mr-2" />
                          Actualizar reseña
                        </div>
                      )}
                    </Button>
                  )}
                </reviewForm.Subscribe>
              </form>
            </div>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline" className="w-full bg-transparent">
                Cancelar
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export { EditReviewDrawer }

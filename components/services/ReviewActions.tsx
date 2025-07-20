"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import ConfirmationButton from "@/components/ConfirmationButton"
import { EditReviewDrawer } from "./EditReviewDrawer"
import { useDeleteReview } from "@/hooks/useEditReviewForm"
import { Edit2, Trash2 } from "lucide-react"

interface ReviewActionsProps {
  reviewId: string
  currentRating: number
  currentComment?: string
  onReviewUpdated: () => void
}

export const ReviewActions = ({
  reviewId,
  currentRating,
  currentComment,
  onReviewUpdated
}: ReviewActionsProps) => {
  const [editDrawerOpen, setEditDrawerOpen] = useState(false)
  const { deleteReview } = useDeleteReview({
    reviewId,
    onSuccess: onReviewUpdated
  })

  const handleEditSuccess = () => {
    setEditDrawerOpen(false)
    onReviewUpdated()
  }

  return (
    <div className="flex items-center space-x-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setEditDrawerOpen(true)}
        className="text-muted-foreground hover:text-foreground h-8 w-8 p-0"
        title="Editar reseña"
      >
        <Edit2 className="w-4 h-4" />
      </Button>

      <ConfirmationButton
        onConfirm={deleteReview}
        triggerText={<Trash2 className="w-4 h-4" />}
        dialogTitle="Eliminar reseña"
        dialogDescription="¿Estás seguro de que quieres eliminar esta reseña? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="ghost"
        size="sm"
      />

      <EditReviewDrawer
        reviewId={reviewId}
        initialRating={currentRating}
        initialComment={currentComment}
        open={editDrawerOpen}
        onOpenChange={setEditDrawerOpen}
        onReviewUpdated={handleEditSuccess}
      />
    </div>
  )
}

"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AddMedicationForm } from "@/components/health/forms/add-medication-form";

interface EditMedicationDialogProps {
  medication: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditMedicationDialog({
  medication,
  open,
  onOpenChange,
}: EditMedicationDialogProps) {
  const handleSuccess = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Medicamento</DialogTitle>
          <DialogDescription>
            Modifica la información del medicamento
          </DialogDescription>
        </DialogHeader>
        <AddMedicationForm
          initialData={medication}
          isEditing={true}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}

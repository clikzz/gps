"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AddVaccinationForm } from "@/components/health/forms/add-vaccination-form";

interface EditVaccinationDialogProps {
  vaccination: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditVaccinationDialog({
  vaccination,
  open,
  onOpenChange,
}: EditVaccinationDialogProps) {
  const handleSuccess = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Vacuna</DialogTitle>
          <DialogDescription>
            Modifica la información de la vacuna
          </DialogDescription>
        </DialogHeader>
        <AddVaccinationForm
          initialData={vaccination}
          isEditing={true}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}

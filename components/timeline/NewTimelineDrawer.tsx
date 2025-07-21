"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import NewTimelineForm from "@/components/timeline/NewTimelineForm";
import { TimelineEntryWithPhotos } from "@/types/timeline";

interface NewTimelineDrawerProps {
  petId: string;
  onSuccess?: () => void;
  mode?: "create" | "edit";
  entryToEdit?: TimelineEntryWithPhotos;
}

export default function NewTimelineDrawer({
  petId,
  onSuccess,
  mode = "create",
  entryToEdit,
}: NewTimelineDrawerProps) {
  const [open, setOpen] = useState(false);
  const isEdit = mode === "edit";

  const triggerLabel = isEdit ? "Editar" : "Añadir Recuerdo";
  const titleText = isEdit ? "Editar" : "Nuevo Recuerdo";
  const descriptionText = isEdit
    ? "Modifica un momento especial de tu mascota."
    : "Documenta un momento especial de tu mascota.";
  const actionButtonText = isEdit ? "Guardar cambios" : "Crear Recuerdo";

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">{triggerLabel}</Button>
      </DrawerTrigger>

      <DrawerContent className="bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark">
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader className="flex flex-col items-center justify-center">
            <DrawerTitle className="text-center">{titleText}</DrawerTitle>
            <DrawerDescription className="text-center">
              {descriptionText}
            </DrawerDescription>
          </DrawerHeader>

          <div className="overflow-y-auto max-h-[60vh] px-4">
            <NewTimelineForm
              petId={petId}
              mode={mode}
              initialValues={entryToEdit}
              onSuccess={() => {
                onSuccess?.();
                setOpen(false);
              }}
              submitButtonText={actionButtonText}
            />
          </div>

          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
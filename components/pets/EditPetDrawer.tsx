"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import type { Pet } from "@/types/pet";
import Image from "next/image";
import EditPetForm from "./EditPetForm";
import { Trash } from "lucide-react";
import { Image as IMG } from "lucide-react";
import ConfirmationButton from "@/components/ConfirmationButton";
import {
  handleDeletePhoto,
  handleSoftDelete,
  handleDisablePet,
} from "@/hooks/useEditPet";

export function EditPetDrawer({
  pet,
  open,
  onOpenChange,
}: {
  pet: Pet;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const handleClose = () => {
    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  const handleFormSuccess = () => {
    handleClose();
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader className="flex flex-col items-center justify-center">
            <DrawerTitle className="text-center">
              Editando a {pet.name}
            </DrawerTitle>
            <DrawerDescription>
              Modifica los datos asociados a tu mascota
            </DrawerDescription>
          </DrawerHeader>
          <div className="overflow-y-auto max-h-[50vh] px-4">
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-[150px] h-[150px] mb-4 rounded-full">
                {!pet.photo_url && (
                  <div className="justify-center rounded-full flex items-center w-full h-full">
                    <IMG />
                  </div>
                )}
                {pet.photo_url && (
                  <div>
                    <div className="absolute top-2 right-2 h-7 w-7">
                      <ConfirmationButton
                        onConfirm={() => handleDeletePhoto(pet)}
                        triggerText={<Trash className="w-2 h-2" />}
                        dialogTitle="Confirmar eliminación de foto"
                        dialogDescription="¿Estás seguro de que quieres eliminar esta foto? Esta acción no se puede deshacer."
                        confirmText="Eliminar"
                        cancelText="Cancelar"
                        variant="destructive"
                      />
                    </div>

                    <Image
                      src={pet.photo_url}
                      alt={pet.name}
                      width={150}
                      height={150}
                      className="object-cover w-full h-full rounded-full"
                    />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 mb-4">
                <ConfirmationButton
                  onConfirm={() => handleSoftDelete(pet)}
                  triggerText="Eliminar"
                  dialogTitle="Confirmar eliminación de mascota"
                  dialogDescription="¿Estás seguro de que quieres eliminar esta mascota? Esta acción no se puede deshacer."
                  confirmText="Eliminar"
                  cancelText="Cancelar"
                  variant="default"
                  size="sm"
                />

                <ConfirmationButton
                  onConfirm={() => handleDisablePet(pet)}
                  triggerText="Marcar como fallecida"
                  dialogTitle="Confirmar fallecimiento de mascota"
                  dialogDescription="¿Estás seguro de que quieres informar como fallecida esta mascota? Esta acción no se puede deshacer."
                  confirmText="Eliminar"
                  cancelText="Cancelar"
                  variant="outline"
                  size="sm"
                />
              </div>

              <div className="w-full">
                <EditPetForm pet={pet} onSuccess={handleFormSuccess} />
              </div>
            </div>
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

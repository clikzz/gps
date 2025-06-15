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
import { useUserProfile } from "@/stores/userProfile";
import { Image as IMG } from "lucide-react";

export function EditPetDrawer({
  pet,
  open,
  onOpenChange,
}: {
  pet: Pet;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const user = useUserProfile.getState().user;

  const handleClose = () => {
    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  const handleFormSuccess = () => {
    handleClose();
  };

  const handleDeletePhoto = async () => {
    try {
      const response = await fetch(`/api/upload/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: pet.photo_url,
        }),
      });

      if (response.ok) {
        console.log("Foto eliminada correctamente");
      } else {
        console.error("Error al eliminar la foto");
      }
      const responseDB = await fetch(`/api/pets`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...pet,
          photo_url: null,
        }),
      });
      if (!responseDB.ok) {
        console.error("Error al actualizar la mascota sin foto");
        return;
      }
      const updatedPet = await responseDB.json();
      if (user) {
        const updatedPets = user.pets.map((p) =>
          p.id === pet.id ? updatedPet : p
        );
        useUserProfile.getState().setUser({ ...user, pets: updatedPets });
      }
      pet.photo_url = null;
    } catch (error) {
      console.error("Error al eliminar la foto:", error);
    }
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
                    <Button
                      className="absolute top-2 right-2 h-7 w-7 items-center justify-center rounded-full p-0"
                      variant="destructive"
                      size="icon"
                      onClick={handleDeletePhoto}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
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

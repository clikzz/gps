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
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Pets as Pet } from "@prisma/client";
import Image from "next/image";
import EditPetForm from "./EditPetForm";

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

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="opacity-0 pointer-events-none">
          Detalles de {pet.name}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader className="flex flex-col items-center justify-center">
            <DrawerTitle className="text-center">
              Detalles de {pet.name}
            </DrawerTitle>
            <DrawerDescription>
              Modifica los datos asociados a tu mascota
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex items-center justify-center flex-col">
            <div className="overflow-hidden rounded-full w-[150px] h-[150px]">
              <Image
                src={pet.photo_url || "/placeholder.png"}
                alt={pet.name}
                width={150}
                height={150}
                className="object-cover w-full h-full"
              />
            </div>
            <EditPetForm />
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

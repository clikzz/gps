"use client";

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
import { AddVaccinationForm } from "@/components/health/forms/add-vaccination-form";
import { useState } from "react";
import { Plus } from "lucide-react";

export function AddVaccinationDrawer() {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen} modal={false}>
      <DrawerTrigger asChild>
        <Button className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Agregar Vacuna
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Agregar Vacuna</DrawerTitle>
            <DrawerDescription>
              Registra una nueva vacuna para tu mascota
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4">
            <AddVaccinationForm onSuccess={handleSuccess} />
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

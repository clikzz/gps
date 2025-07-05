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
import { AddMedicationForm } from "@/components/health/forms/add-medication-form";
import { useState } from "react";
import { Plus } from "lucide-react";
import { fa } from "zod/dist/types/v4/locales";

export function AddMedicationDrawer() {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen} modal={false}>
      <DrawerTrigger asChild>
        <Button className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Agregar Medicamento
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[75vh]">
        <div className="mx-auto w-full max-w-sm h-full flex flex-col">
          <DrawerHeader>
            <DrawerTitle>Agregar Medicamento</DrawerTitle>
            <DrawerDescription>
              Registra un nuevo medicamento para tu mascota
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 flex-1 overflow-y-auto">
            <AddMedicationForm onSuccess={handleSuccess} />
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

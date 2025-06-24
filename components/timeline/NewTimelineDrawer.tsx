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

interface NewTimelineDrawerProps {
  petId: string;
  onSuccess?: () => void;
}

export default function NewTimelineDrawer({
  petId,
  onSuccess,
}: NewTimelineDrawerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">Añadir Recuerdo</Button>
      </DrawerTrigger>

      <DrawerContent className="bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark">
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader className="flex flex-col items-center justify-center">
            <DrawerTitle className="text-center">Nuevo Recuerdo</DrawerTitle>
            <DrawerDescription className="text-center">
              Documenta un momento especial de tu mascota.
            </DrawerDescription>
          </DrawerHeader>

          <div className="overflow-y-auto max-h-[60vh] px-4">
            <NewTimelineForm
              petId={petId}
              onSuccess={() => {
                onSuccess?.();
                setOpen(false);
              }}
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

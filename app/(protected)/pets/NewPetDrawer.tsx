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
import NewPetForm from "./NewPetForm";

export function NewPetDrawer() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Nueva Mascota</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader className="flex flex-col items-center justify-center">
            <DrawerTitle className="text-center">Nueva Mascota</DrawerTitle>
            <DrawerDescription>
              Ingresa los datos asociados a tu nueva mascota
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <NewPetForm />
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

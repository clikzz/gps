"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "@/components/ui/drawer";
import NewItemForm from "@/components/marketplace/NewItemForm";

export function NewItemDrawer() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="default">Agregar artículo</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader className="flex flex-col items-center justify-center">
            <DrawerTitle className="text-center">Nuevo artículo</DrawerTitle>
            <DrawerDescription>
              Completa los datos para publicar tu artículo
            </DrawerDescription>
          </DrawerHeader>

          <div className="overflow-y-auto max-h-[60vh] px-4">
            <NewItemForm />
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
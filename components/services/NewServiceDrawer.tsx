"use client"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import NewServiceForm from "./NewServiceForm"

export function NewServiceDrawer() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline"> Agregar Servicio </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader className="flex flex-col items-center justify-center">
            <DrawerTitle className="text-center">Nuevo Servicio</DrawerTitle>
            <DrawerDescription>Ingresa los datos asociados a tu nuevo servicio</DrawerDescription>
          </DrawerHeader>
          <div className="overflow-y-auto max-h-[50vh] px-4">
            <NewServiceForm />
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

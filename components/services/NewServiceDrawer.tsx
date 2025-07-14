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
import { MapPin, Plus, Edit } from "lucide-react"

interface NewServiceDrawerProps {
  userLocation: { lat: number; lng: number }
  onStartLocationSelection: () => void
  onCancelLocationSelection: () => void
  onOpenExistingSelection: () => void
  selectedServiceLocation: { lat: number; lng: number } | null
  isSelectingLocation: boolean
  open: boolean
  onOpenChange: (open: boolean) => void
  onServiceCreated: () => void
}

export function NewServiceDrawer({
  userLocation,
  onStartLocationSelection,
  onCancelLocationSelection,
  onOpenExistingSelection,
  selectedServiceLocation,
  isSelectingLocation,
  open,
  onOpenChange,
  onServiceCreated,
}: NewServiceDrawerProps) {
  if (!userLocation || !userLocation.lat || !userLocation.lng) {
    return (
      <Button variant="outline" disabled>
        Obteniendo ubicación...
      </Button>
    )
  }

  const handleTriggerClick = () => {
    if (selectedServiceLocation && !isSelectingLocation) {
      onOpenExistingSelection()
    } else {
      onStartLocationSelection()
    }
  }

  const getButtonContent = () => {
    if (selectedServiceLocation && !isSelectingLocation) {
      return (
        <>
          <Edit className="w-4 h-4 mr-2" />
          Completar servicio
        </>
      )
    }
    return (
      <>
        Agregar servicio
      </>
    )
  }

  const getButtonVariant = () => {
    if (selectedServiceLocation && !isSelectingLocation) {
      return "default"
    }
    return "outline"
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>
        <Button variant={getButtonVariant()} onClick={handleTriggerClick}>
          {getButtonContent()}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-lg">
          <DrawerHeader className="flex flex-col items-center justify-center">
            <DrawerTitle className="text-center">Nuevo Servicio</DrawerTitle>
            <DrawerDescription className="text-center">
              {!selectedServiceLocation
                ? "Haz clic en el mapa para seleccionar la ubicación de tu servicio"
                : "Completa los datos de tu servicio"}
            </DrawerDescription>
          </DrawerHeader>
          <div className="overflow-y-auto max-h-[60vh] px-4">
            <NewServiceForm
              userLocation={userLocation}
              selectedServiceLocation={selectedServiceLocation}
              isSelectingLocation={isSelectingLocation}
              onCancelLocationSelection={onCancelLocationSelection}
              onServiceCreated={onServiceCreated}
            />
          </div>
          <DrawerFooter>
            <div className="flex space-x-2">
              {selectedServiceLocation && !isSelectingLocation && (
                <Button
                  variant="outline"
                  onClick={() => {
                    onCancelLocationSelection()
                    onStartLocationSelection()
                  }}
                  className="flex-1"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Cambiar ubicación
                </Button>
              )}
              <DrawerClose asChild>
                <Button variant="outline" onClick={onCancelLocationSelection} className="flex-1 bg-transparent">
                  Cancelar
                </Button>
              </DrawerClose>
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

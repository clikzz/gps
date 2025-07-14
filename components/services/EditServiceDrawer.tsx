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
} from "@/components/ui/drawer"
import EditServiceForm from "./EditServiceForm"
import { MapPin, Trash2 } from "lucide-react"

interface Service {
  id: string
  name: string
  categories: string[]
  description: string
  latitude: number
  longitude: number
  phone: string
}

interface EditServiceDrawerProps {
  service: Service | null
  onStartLocationSelection: () => void
  onCancelLocationSelection: () => void
  selectedServiceLocation: { lat: number; lng: number } | null
  isSelectingLocation: boolean
  open: boolean
  onOpenChange: (open: boolean) => void
  onServiceUpdated: () => void
  onServiceDeleted?: () => void
  showDeleteButton?: boolean
}

export function EditServiceDrawer({
  service,
  onStartLocationSelection,
  onCancelLocationSelection,
  selectedServiceLocation,
  isSelectingLocation,
  open,
  onOpenChange,
  onServiceUpdated,
  onServiceDeleted,
  showDeleteButton = false,
}: EditServiceDrawerProps) {
  if (!service) return null

  const handleDeleteService = async () => {
    if (!onServiceDeleted) return

    const confirmed = window.confirm(
      "¿Estás seguro de que quieres eliminar este servicio? Esta acción no se puede deshacer.",
    )
    if (!confirmed) return

    try {
      const response = await fetch(`/api/services?id=${service.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        onServiceDeleted()
        onOpenChange(false)
      } else {
        alert("Error al eliminar el servicio")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error al eliminar el servicio")
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-lg">
          <DrawerHeader className="flex flex-col items-center justify-center">
            <DrawerTitle className="text-center">Editar Servicio</DrawerTitle>
            <DrawerDescription className="text-center">
              {isSelectingLocation
                ? "Haz clic en el mapa para cambiar la ubicación del servicio"
                : "Modifica los datos de tu servicio"}
            </DrawerDescription>
          </DrawerHeader>
          <div className="overflow-y-auto max-h-[60vh] px-4">
            <EditServiceForm
              service={service}
              selectedServiceLocation={selectedServiceLocation}
              isSelectingLocation={isSelectingLocation}
              onCancelLocationSelection={onCancelLocationSelection}
              onServiceUpdated={onServiceUpdated}
            />
          </div>
          <DrawerFooter>
            <div className="flex space-x-2">
              {!isSelectingLocation && (
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

              {showDeleteButton && onServiceDeleted && (
                <Button variant="destructive" onClick={handleDeleteService} className="flex-1">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar
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

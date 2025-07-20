"use client"

import { useState } from "react"
import { createPortal } from "react-dom"
import { useEffect } from "react"
import RequestLocation from "@/components/services/RequestLocation"
import Map from "@/components/services/Map"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { NewServiceDrawer } from "@/components/services/NewServiceDrawer"
import { EditServiceDrawer } from "@/components/services/EditServiceDrawer"

interface Service {
  id: string
  name: string
  categories: string[]
  description: string
  latitude: number
  longitude: number
  phone: string
}

export default function MapsPage() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [mounted, setMounted] = useState(false)
  const [isSelectingLocation, setIsSelectingLocation] = useState(false)
  const [selectedServiceLocation, setSelectedServiceLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const [editingService, setEditingService] = useState<Service | null>(null)
  const [editDrawerOpen, setEditDrawerOpen] = useState(false)
  const [isSelectingEditLocation, setIsSelectingEditLocation] = useState(false)
  const [selectedEditLocation, setSelectedEditLocation] = useState<{ lat: number; lng: number } | null>(null)

  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLocationReceived = (userLocation: { lat: number; lng: number }) => {
    setLocation(userLocation)
  }

  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  const handleStartLocationSelection = () => {
    setIsSelectingLocation(true)
    setSelectedServiceLocation(null)
    setDrawerOpen(true)
  }

  const handleLocationSelect = (serviceLocation: { lat: number; lng: number }) => {
    if (isSelectingEditLocation) {
      setSelectedEditLocation(serviceLocation)
      setIsSelectingEditLocation(false)
      setEditDrawerOpen(true)
    } else {
      setSelectedServiceLocation(serviceLocation)
      setIsSelectingLocation(false)
      setDrawerOpen(true)
    }
  }

  const handleCancelLocationSelection = () => {
    setIsSelectingLocation(false)
    setSelectedServiceLocation(null)
    setDrawerOpen(false)
  }

  const handleOpenExistingSelection = () => {
    setDrawerOpen(true)
  }

  const handleServiceCreated = () => {
    setIsSelectingLocation(false)
    setSelectedServiceLocation(null)
    setDrawerOpen(false)
    triggerRefresh()
  }

  const handleEditService = (service: any) => {
    let categories: string[] = []

    if (service.categories && Array.isArray(service.categories)) {
      categories = service.categories
    } else if (service.category && typeof service.category === "string") {
      categories = service.category
        .split(",")
        .map((cat: string) => cat.trim())
        .filter((cat: string) => cat.length > 0)
    }

    const serviceToEdit: Service = {
      id: service.id.replace("custom-", "").split("-")[0],
      name: service.name,
      categories: categories,
      description: service.description || "",
      latitude: service.lat,
      longitude: service.lng,
      phone: service.phone || "",
    }

    setEditingService(serviceToEdit)
    setSelectedEditLocation(null)
    setIsSelectingEditLocation(false)
    setEditDrawerOpen(true)
  }

  const handleStartEditLocationSelection = () => {
    setIsSelectingEditLocation(true)
    setSelectedEditLocation(null)
    setEditDrawerOpen(true)
  }

  const handleCancelEditLocationSelection = () => {
    setIsSelectingEditLocation(false)
    setSelectedEditLocation(null)
    setEditDrawerOpen(false)
    setEditingService(null)
  }

  const handleServiceUpdated = () => {
    setIsSelectingEditLocation(false)
    setSelectedEditLocation(null)
    setEditDrawerOpen(false)
    setEditingService(null)
    triggerRefresh()
  }

  if (!location) {
    return (
      <div className="flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Permitir Ubicación</CardTitle>
            <CardDescription className="text-center">
              Encuentra servicios para mascotas cerca de tu ubicación
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <RequestLocation onLocationReceived={handleLocationReceived} />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const mapContent = (
    <div className="fixed left-0 right-0 z-30 top-0 md:top-16 bottom-0">
      <Map
        userLocation={location}
        isSelectingLocation={isSelectingLocation || isSelectingEditLocation}
        selectedServiceLocation={selectedServiceLocation || selectedEditLocation}
        onLocationSelect={handleLocationSelect}
        onEditService={handleEditService}
        refreshTrigger={refreshTrigger}
      />

      <div className="absolute top-4 right-4 z-40 pr-8 md:pr-8">
        <div className="md:block">
          <NewServiceDrawer
            userLocation={location}
            onStartLocationSelection={handleStartLocationSelection}
            onCancelLocationSelection={handleCancelLocationSelection}
            onOpenExistingSelection={handleOpenExistingSelection}
            selectedServiceLocation={selectedServiceLocation}
            isSelectingLocation={isSelectingLocation}
            open={drawerOpen}
            onOpenChange={setDrawerOpen}
            onServiceCreated={handleServiceCreated}
          />
        </div>
      </div>

      <EditServiceDrawer
        service={editingService}
        onStartLocationSelection={handleStartEditLocationSelection}
        onCancelLocationSelection={handleCancelEditLocationSelection}
        selectedServiceLocation={selectedEditLocation}
        isSelectingLocation={isSelectingEditLocation}
        open={editDrawerOpen}
        onOpenChange={setEditDrawerOpen}
        onServiceUpdated={handleServiceUpdated}
        showDeleteButton={true}
      />

      {(isSelectingLocation || isSelectingEditLocation) && (
        <div className="absolute top-4 left-4 z-40 bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-lg border">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-gray-600 rounded-full animate-pulse"></div>
            <div>
              <h3 className="font-semibold text-gray-800">Modo selección activo</h3>
              <p className="text-sm text-gray-600">
                {isSelectingEditLocation
                  ? "Haz clic en el mapa para cambiar la ubicación del servicio"
                  : "Haz clic en el mapa para seleccionar la ubicación del servicio"}
              </p>
            </div>
          </div>
        </div>
      )}

      {selectedServiceLocation && !isSelectingLocation && !drawerOpen && (
        <div className="absolute bottom-4 left-4 z-40 bg-gray-50 border border-gray-200 p-4 rounded-lg shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
            <div>
              <h3 className="font-semibold text-gray-800">Ubicación seleccionada</h3>
              <p className="text-sm text-gray-600">
                {selectedServiceLocation.lat.toFixed(4)}, {selectedServiceLocation.lng.toFixed(4)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Presiona "Completar servicio" para continuar</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <>
      <div className="hidden md:block h-4" />
      {mounted ? createPortal(mapContent, document.body) : null}
    </>
  )
}

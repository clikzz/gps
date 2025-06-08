"use client"

import { useState } from "react"
import { createPortal } from "react-dom"
import { useEffect } from "react"
import RequestLocation from "./RequestLocation"
import Map from "./Map"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function MapsPage() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLocationReceived = (userLocation: { lat: number; lng: number }) => {
    console.log("Ubicación recibida en page.tsx:", userLocation)
    setLocation(userLocation)
  }
  if (!location) {
    return (
      <div className="flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Solicitar Ubicación</CardTitle>
            <CardDescription className="text-center">
              Encuentra servicios para mascotas cerca de tu ubicación
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <RequestLocation onLocationReceived={handleLocationReceived} />
            </div>

            <div className="text-xs text-gray-500 text-center">
              <p>Necesitamos tu ubicación para mostrarte servicios cercanos.</p>
              <p>El navegador solicitará permiso para acceder a tu ubicación.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
  const mapContent = (
    <div
      className="fixed left-0 right-0 bg-white z-30"
      style={{
        top: "64px",
        bottom: "0",
      }}
    >
      <div className="bg-black px-6 py-4 flex justify-between items-center">
      <div>
        <h1 className="text-xl font-semibold text-white">Servicios para Mascotas</h1>
        <p className="text-sm text-gray-300">
          Ubicación: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
        </p>
      </div>
      <div className="flex gap-4">
        <button
          onClick={() => setLocation(null)}
          className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Actualizar ubicación
        </button>
        <button
          className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Agregar Servicio
        </button>
      </div>
    </div>
      <div className="h-[calc(100%-80px)]">
        <Map userLocation={location} />
      </div>
    </div>
  )
  return (
    <>
      <div className="h-4" />
      {mounted ? createPortal(mapContent, document.body) : null}
    </>
  )
}

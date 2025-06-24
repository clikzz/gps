"use client"

import { useState } from "react"
import { createPortal } from "react-dom"
import { useEffect } from "react"
import RequestLocation from "@/components/services/RequestLocation"
import Map from "@/components/services/Map"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { NewServiceDrawer } from "@/components/services/NewServiceDrawer"

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
    <div
      className="fixed left-0 right-0 z-30"
      style={{
        top: "64px",
        bottom: "0",
      }}
    >
      <Map userLocation={location} />
      <div className="absolute top-4 right-4 z-40 pr-8">
        <NewServiceDrawer />
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

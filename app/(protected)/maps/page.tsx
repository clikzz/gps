"use client"

import { useState } from "react"
import RequestLocation from "./RequestLocation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestLocationPage() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)

  const handleLocationReceived = (userLocation: { lat: number; lng: number }) => {
    setLocation(userLocation)
  }

  return (
    <div className="p-4 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Prueba de Ubicación</CardTitle>
          <CardDescription className="text-center">
            Prueba la funcionalidad de solicitar ubicación del usuario
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <RequestLocation onLocationReceived={handleLocationReceived} />
          </div>

          {location && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">Ubicación obtenida:</h3>
              <div className="space-y-1 text-sm text-green-700">
                <p>
                  <strong>Latitud:</strong> {location.lat}
                </p>
                <p>
                  <strong>Longitud:</strong> {location.lng}
                </p>
                <p className="text-xs text-green-600 mt-2">
                  Coordenadas: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                </p>
              </div>
            </div>
          )}

          <div className="text-xs text-gray-500 text-center">
            <p>Esta es una página para probar la obtencion de ubicacion del usuario.</p>
            <p>El navegador debería solicitar permiso para acceder a tu ubicación.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

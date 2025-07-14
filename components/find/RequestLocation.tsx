"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MapPin, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useLocationStore } from "@/stores/location"

interface RequestLocationProps {
  onLocationReady?: (loc: { lat: number; lng: number }) => void
}

export default function RequestLocation({ onLocationReady }: RequestLocationProps) {
  const [loading, setLoading] = useState(false)
  const [usingIPLocation, setUsingIPLocation] = useState(false)
  const { setPosition } = useLocationStore()

  const getLocationFromIP = async () => {
    try {
      setUsingIPLocation(true)
      const response = await fetch('https://ipapi.co/json/')
      if (!response.ok) throw new Error('Error IP')
      const data = await response.json()
      if (!data.latitude || !data.longitude) throw new Error("Sin coords")
      const pos = {
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
        timestamp: Date.now()
      }
      setPosition(pos)
      onLocationReady?.({ lat: pos.latitude, lng: pos.longitude })
      return true
    } finally {
      setUsingIPLocation(false)
    }
  }

  const requestLocation = async () => {
    setLoading(true)
    if (!navigator.geolocation) {
      await getLocationFromIP()
      setLoading(false)
      return
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const pos = {
          latitude: coords.latitude,
          longitude: coords.longitude,
          timestamp: Date.now()
        }
        setPosition(pos)
        onLocationReady?.({ lat: pos.latitude, lng: pos.longitude })
        setLoading(false)
      },
      async () => {
        const ok = await getLocationFromIP()
        if (!ok)
          toast.error("No se pudo obtener tu ubicación")
        setLoading(false)
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 300000 }
    )
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      {loading ? (
        <div className="flex flex-col items-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
          <p className="text-gray-600">
            {usingIPLocation ? "Obteniendo ubicación aproximada..." : "Obteniendo tu ubicación..."}
          </p>
          <p className="text-sm text-gray-500">
            {usingIPLocation
              ? "Usando tu dirección IP para ubicación aproximada"
              : "Por favor, permite el acceso a tu ubicación"
            }
          </p>
        </div>
      ) : (
        <Button type="submit" onClick={requestLocation} size="lg">
          <MapPin className="mr-2 h-5 w-5" />
          Obtener mi ubicación
        </Button>
      )}

      <div className="text-xs text-gray-500 text-center max-w-sm">
        <p>
          Necesitamos tu ubicación para mostrarte mascotas perdidas cercanas. A veces, 
          esta ubicación puede ser aproximada.
        </p>
      </div>
    </div>
  )
}

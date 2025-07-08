"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MapPin, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface RequestLocationProps {
  onLocationReceived: (location: { lat: number; lng: number }) => void
}

const RequestLocation = ({ onLocationReceived }: RequestLocationProps) => {
  const [loading, setLoading] = useState(false)
  const [usingIPLocation, setUsingIPLocation] = useState(false)
  const getLocationFromIP = async () => {
    try {
      setUsingIPLocation(true)
      const response = await fetch('https://ipapi.co/json/')

      if (!response.ok) {
        throw new Error('Error al obtener ubicación por IP')
      }

      const data = await response.json()

      if (data.latitude && data.longitude) {
        const newLocation = {
          lat: parseFloat(data.latitude),
          lng: parseFloat(data.longitude),
        }
        onLocationReceived(newLocation)
        return true
      } else {
        throw new Error('No se pudieron obtener coordenadas')
      }
    } catch (error) {
      console.error('Error obteniendo ubicación por IP:', error)
      return false
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
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        onLocationReceived(newLocation)
        setLoading(false)
      },
      async (err) => {
        console.error('Error de geolocalización:', err)


        const ipLocationSuccess = await getLocationFromIP()
        if (!ipLocationSuccess) {
          toast.error("No se pudo obtener tu ubicación", {
            description: "Por favor, intenta de nuevo o verifica tu conexión.",
          })
        }

        setLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 300000,
      },
    )
  }

  return (    <div className="flex flex-col items-center space-y-4">
      {loading ? (
        <div className="flex flex-col items-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
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
          Intentaremos obtener tu ubicación precisa primero. Si no es posible, usaremos tu dirección IP para
          mostrarte servicios para mascotas cercanos.
        </p>
      </div>
    </div>
  )
}

export default RequestLocation

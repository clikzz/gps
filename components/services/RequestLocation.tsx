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

  const requestLocation = () => {
    setLoading(true)

    if (!navigator.geolocation) {
      toast.error("Error de geolocalización", {
        description: "La geolocalización no es soportada por este navegador.",
      })
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        toast.success("Ubicación obtenida", {
          description: "Cargando mapa...",
        })

        onLocationReceived(newLocation)
        setLoading(false)
      },
      (err) => {
        if (err.code === 1) {
          toast.error("Permiso denegado", {
            description:
              "Has denegado el permiso para acceder a tu ubicación. Haz clic en el botón para intentar de nuevo.",
          })
        } else if (err.code === 2) {
          toast.error("Ubicación no disponible", {
            description: "Tu ubicación no está disponible en este momento. Inténtalo de nuevo.",
          })
        } else if (err.code === 3) {
          toast.error("Tiempo de espera agotado", {
            description: "Se agotó el tiempo para obtener tu ubicación. Inténtalo de nuevo.",
          })
        } else {
          toast.error("Error de geolocalización", {
            description: `No se pudo obtener la ubicación: ${err.message}`,
          })
        }

        setLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      },
    )
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      {loading ? (
        <div className="flex flex-col items-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          <p className="text-gray-600">Obteniendo tu ubicación...</p>
          <p className="text-sm text-gray-500">Por favor, permite el acceso a tu ubicación</p>
        </div>
      ) : (
        <Button onClick={requestLocation} className="bg-purple-600 hover:bg-purple-700" size="lg">
          <MapPin className="mr-2 h-5 w-5" />
          Permitir acceso a ubicación
        </Button>
      )}

      <div className="text-xs text-gray-500 text-center max-w-sm">
        <p>
          Necesitamos tu ubicación para mostrarte servicios para mascotas cercanos como veterinarias, tiendas y
          peluquerías.
        </p>
      </div>
    </div>
  )
}

export default RequestLocation

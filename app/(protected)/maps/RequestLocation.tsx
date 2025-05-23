"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"
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
        description: "Su navegador actual no soporta la geolocalización.",
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
          description: `Lat: ${newLocation.lat.toFixed(6)}, Lng: ${newLocation.lng.toFixed(6)}`,
        })

        onLocationReceived(newLocation)
        setLoading(false)
      },
      (err) => {
        if (err.code === 1) {
          toast.error("Permiso denegado", {
            description:
              "Has denegado el permiso para acceder a tu ubicación. Por favor, habilita el acceso en la configuración de tu navegador.",
          })
        } else if (err.code === 2) {
          toast.error("Ubicación no disponible", {
            description: "Tu ubicación no está disponible en este momento. Inténtalo de nuevo más tarde.",
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
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  return (
    <div className="flex flex-col items-center">
      <Button onClick={requestLocation} disabled={loading} className="bg-purple-600 hover:bg-purple-700" size="lg">
        <MapPin className="mr-2 h-5 w-5" />
        {loading ? "Obteniendo ubicación..." : "Compartir mi ubicación"}
      </Button>
      <p className="text-sm text-gray-500 mt-2">Necesitamos tu ubicación para mostrarte servicios cercanos</p>
    </div>
  )
}

export default RequestLocation

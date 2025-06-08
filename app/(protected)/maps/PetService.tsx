"use client"

import { useState, useEffect } from "react"
import { Marker, Popup } from "react-map-gl/mapbox"
import { MapPin, Navigation, Star } from "lucide-react"
import { toast } from "sonner"

interface PetServiceProps {
  userLocation: { lat: number; lng: number }
}

interface RealPetService {
  id: string
  name: string
  address: string
  lat: number
  lng: number
  category: string
  distance?: number
}

export default function PetService({ userLocation }: PetServiceProps) {
  const [petServices, setPetServices] = useState<RealPetService[]>([])
  const [selectedService, setSelectedService] = useState<RealPetService | null>(null)
  const [loading, setLoading] = useState(false)

  const searchTerms = [
    "veterinaria",
    "veterinario",
    "booster",
    "Booster",
    "BOOSTER",
    "veterinary",
    "animal hospital",
    "pet store",
    "tienda de mascotas",
    "dog grooming",
    "peluquería canina",
    "pet grooming",
    "animal clinic",
    "clínica veterinaria",
    "pet shop",
    "mascotas",
    "clínica booster",
    "veterinaria booster",
  ]

  const searchPetServices = async (lat: number, lng: number) => {
    setLoading(true)
    const allServices: RealPetService[] = []

    try {
      for (const term of searchTerms) {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(term)}.json?` +
            `proximity=${lng},${lat}&` +
            `bbox=${lng - 0.05},${lat - 0.05},${lng + 0.05},${lat + 0.05}&` +
            `limit=5&` +
            `access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN_SERVICES}`,
        )

        if (response.ok) {
          const data = await response.json()

          data.features?.forEach((feature: any) => {
            const placeName = (feature.place_name || "").toLowerCase()
            const text = (feature.text || "").toLowerCase()

            const petKeywords = [
              "veterinaria",
              "veterinario",
              "canino",
              "perro",
              "gato",
              "mascota",
              "mascotas",
              "animal",
              "pet",
              "dog",
              "cat",
              "peluquería",
              "grooming",
              "tienda",
              "pet shop",
              "petstore",
              "clínica",
              "booster",
            ]

            const isPetRelated = petKeywords.some((kw) => placeName.includes(kw) || text.includes(kw))

            if (isPetRelated && feature.geometry?.coordinates) {
              const [serviceLng, serviceLat] = feature.geometry.coordinates
              const distance = calculateDistance(lat, lng, serviceLat, serviceLng)

              if (distance <= 10) {
                const service: RealPetService = {
                  id: feature.id || `${serviceLat}-${serviceLng}`,
                  name: feature.text || "Servicio para mascotas",
                  address: feature.place_name || "Dirección no disponible",
                  lat: serviceLat,
                  lng: serviceLng,
                  category: getCategoryFromText(feature.text || "", term),
                  distance: distance,
                }

                const isDuplicate = allServices.some(
                  (existing) =>
                    Math.abs(existing.lat - service.lat) < 0.001 && Math.abs(existing.lng - service.lng) < 0.001,
                )

                if (!isDuplicate) {
                  allServices.push(service)
                }
              }
            }
          })
        }
      }

      allServices.sort((a, b) => (a.distance || 0) - (b.distance || 0))
      setPetServices(allServices)

      if (allServices.length > 0) {
        toast.success(`Servicios encontrados: ${allServices.length}`, {
          description: "Haz clic en los marcadores para ver más información",
        })
      } else {
        toast.info("No se encontraron servicios", {
          description: "No hay servicios para mascotas cerca de tu ubicación",
        })
      }
    } catch (error) {
      toast.error("Error en la búsqueda", {
        description: "No se pudieron cargar los servicios para mascotas",
      })
    } finally {
      setLoading(false)
    }
  }

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c
    return Math.round(distance * 10) / 10
  }

  const getCategoryFromText = (text: string, searchTerm: string): string => {
    const lowerText = text.toLowerCase()
    const lowerTerm = searchTerm.toLowerCase()

    if (lowerText.includes("booster")) {
      return "Veterinaria Booster"
    }
    if (lowerText.includes("vet") || lowerTerm.includes("hospital")) {
      return "Veterinaria"
    }
    if (lowerText.includes("grooming") || lowerText.includes("peluquer")) {
      return "Peluquería"
    }
    if (lowerText.includes("store") || lowerText.includes("shop") || lowerTerm.includes("tienda")) {
      return "Tienda de mascotas"
    }
    return "Servicio para mascotas"
  }

  const getServiceColor = (category: string): string => {
    switch (category.toLowerCase()) {
      case "veterinaria booster":
        return "text-red-600 hover:text-red-800"
      case "veterinaria":
        return "text-green-600 hover:text-green-800"
      case "tienda de mascotas":
        return "text-blue-600 hover:text-blue-800"
      case "peluquería":
        return "text-pink-600 hover:text-pink-800"
      default:
        return "text-purple-600 hover:text-purple-800"
    }
  }

  const getServiceIcon = (category: string): string => {
    switch (category.toLowerCase()) {
      case "veterinaria booster":
        return "🚀"
      case "veterinaria":
        return "🏥"
      case "tienda de mascotas":
        return "🛒"
      case "peluquería":
        return "✂️"
      default:
        return "🐾"
    }
  }

  const getMapboxDirectionsUrl = (service: RealPetService) => {
    return `https://api.mapbox.com/directions/v5/mapbox/driving/${userLocation.lng},${userLocation.lat};${service.lng},${service.lat}?geometries=geojson&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN_SERVICES}`
  }

  const openMapboxDirections = async (service: RealPetService) => {
    try {
      const response = await fetch(getMapboxDirectionsUrl(service))
      const data = await response.json()

      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0]
        const duration = Math.round(route.duration / 60)
        const distance = (route.distance / 1000).toFixed(1)

        toast.success("Ruta calculada", {
          description: `${distance} km - ${duration} minutos aproximadamente`,
        })

        window.open(
          `https://www.mapbox.com/directions/?origin=${userLocation.lng},${userLocation.lat}&destination=${service.lng},${service.lat}`,
          "_blank",
        )
      }
    } catch (error) {
      toast.error("Error al calcular ruta", {
        description: "No se pudo obtener la ruta con Mapbox",
      })
    }
  }

  useEffect(() => {
    toast.info("Buscando servicios para mascotas...", {
      description: "Esto puede tomar unos segundos",
    })
    searchPetServices(userLocation.lat, userLocation.lng)
  }, [userLocation])

  return (
    <>
      {loading && (
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg z-10">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
            <span className="text-sm text-gray-600">Buscando servicios...</span>
          </div>
        </div>
      )}

      {petServices.map((service) => (
        <Marker
          key={service.id}
          latitude={service.lat}
          longitude={service.lng}
          anchor="bottom"
          onClick={() => setSelectedService(service)}
        >
          <div className="cursor-pointer transform hover:scale-110 transition-transform">
            <MapPin size={32} className={getServiceColor(service.category)} />
            <div className="absolute top-1 left-1/2 transform -translate-x-1/2 text-xs">
              {getServiceIcon(service.category)}
            </div>
          </div>
        </Marker>
      ))}

      {selectedService && (
        <Popup
          latitude={selectedService.lat}
          longitude={selectedService.lng}
          onClose={() => setSelectedService(null)}
          closeOnClick={false}
          anchor="top"
          className="service-popup"
        >
          <div className="p-4 space-y-3 min-w-[280px]">
            <div className="flex items-start justify-between">
              <h3 className="font-bold text-gray-800 text-lg flex items-center">
                <span className="mr-2">{getServiceIcon(selectedService.category)}</span>
                {selectedService.name}
              </h3>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Star className="w-4 h-4 mr-2 text-yellow-500" />
                <span className="font-medium">{selectedService.category}</span>
              </div>

              <div className="flex items-start text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2 mt-0.5 text-gray-400" />
                <span className="flex-1">{selectedService.address}</span>
              </div>

              <div className="flex items-center text-sm font-semibold text-green-600">
                <Navigation className="w-4 h-4 mr-2" />
                <span>{selectedService.distance} km de distancia</span>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-200">
              <button
                onClick={() => openMapboxDirections(selectedService)}
                className="inline-flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
              >
                <Navigation className="w-4 h-4 mr-2" />
                Cómo llegar con Mapbox
              </button>
            </div>
          </div>
        </Popup>
      )}
    </>
  )
}

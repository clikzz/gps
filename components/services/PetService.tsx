"use client"

import { useState, useEffect, useImperativeHandle, forwardRef } from "react"
import { Marker, Popup, Source, Layer } from "react-map-gl/mapbox"
import { MapPin, Navigation, Star, Clock, X, Car, Info, Edit, Phone } from "lucide-react"
import { toast } from "sonner"

interface PetServiceProps {
  userLocation: { lat: number; lng: number }
  onEditService?: (service: RealPetService) => void
  refreshTrigger?: number
}

interface RealPetService {
  id: string
  name: string
  address: string
  lat: number
  lng: number
  category: string
  categories?: string[]
  distance?: number
  isCustom?: boolean
  routeDistance?: string
  routeDuration?: string
  description?: string
  phone?: string
}

interface CustomService {
  id: string
  name: string
  latitude: number
  longitude: number
  description: string
  categories: string[]
  phone?: string
}

export interface PetServiceRef {
  refreshServices: () => void
}

const PetService = forwardRef<PetServiceRef, PetServiceProps>(
  ({ userLocation, onEditService, refreshTrigger }, ref) => {
    const [petServices, setPetServices] = useState<RealPetService[]>([])
    const [selectedService, setSelectedService] = useState<RealPetService | null>(null)
    const [loading, setLoading] = useState(false)
    const [customServicesLoading, setCustomServicesLoading] = useState(false)
    const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string; service: RealPetService } | null>(
      null,
    )
    const [loadingRoute, setLoadingRoute] = useState(false)
    const [routeGeometry, setRouteGeometry] = useState<any>(null)

    const SEARCH_RADIUS_KM = 10

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
      "hospital veterinario",
      "perro",
      "gato",
    ]

    const fetchCustomServices = async () => {
      setCustomServicesLoading(true)
      try {
        const response = await fetch(
          `/api/services?latitude=${userLocation.lat}&longitude=${userLocation.lng}&radius=${SEARCH_RADIUS_KM}`,
        )

        if (response.ok) {
          const data = await response.json()

          const customServices: RealPetService[] = data.map((service: CustomService) => {
            const distance = calculateDistance(userLocation.lat, userLocation.lng, service.latitude, service.longitude)

            return {
              id: `custom-${service.id}-${Date.now()}`,
              name: service.name,
              address: `${service.latitude.toFixed(4)}, ${service.longitude.toFixed(4)}`,
              lat: service.latitude,
              lng: service.longitude,
              category: Array.isArray(service.categories) ? service.categories.join(", ") : "Sin categoría",
              categories: Array.isArray(service.categories) ? service.categories : [],
              distance: distance,
              isCustom: true,
              description: service.description,
              phone: service.phone,
            }
          })

          setPetServices((prevServices) => {
            const mapboxServices = prevServices.filter((service) => !service.isCustom)
            const combinedServices = [...mapboxServices, ...customServices]
            return combinedServices.sort((a, b) => (a.distance || 0) - (b.distance || 0))
          })
        }
      } catch (error) {
        console.error("Error al cargar servicios personalizados:", error)
      } finally {
        setCustomServicesLoading(false)
      }
    }

    const refreshServices = async () => {
      await fetchCustomServices()
    }

    useImperativeHandle(ref, () => ({
      refreshServices,
    }))

    const searchPetServices = async (lat: number, lng: number) => {
      setLoading(true)
      const allServices: RealPetService[] = []

      try {
        const bboxOffset = SEARCH_RADIUS_KM / 111

        for (const term of searchTerms) {
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(term)}.json?` +
              `proximity=${lng},${lat}&` +
              `bbox=${lng - bboxOffset},${lat - bboxOffset},${lng + bboxOffset},${lat + bboxOffset}&` +
              `limit=5&` +
              `access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`,
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
                "hospital veterinario",
                "Hospital Veterinario",
                "clinica veterinaria",
                "perro",
                "gato",
              ]

              const isPetRelated = petKeywords.some((kw) => placeName.includes(kw) || text.includes(kw))

              if (isPetRelated && feature.geometry?.coordinates) {
                const [serviceLng, serviceLat] = feature.geometry.coordinates
                const distance = calculateDistance(lat, lng, serviceLat, serviceLng)

                if (distance <= SEARCH_RADIUS_KM) {
                  const service: RealPetService = {
                    id: `mapbox-${feature.id || `${serviceLat}-${serviceLng}`}-${Date.now()}`,
                    name: feature.text || "Servicio para mascotas",
                    address: feature.place_name || "Dirección no disponible",
                    lat: serviceLat,
                    lng: serviceLng,
                    category: getCategoryFromText(feature.text || "", term),
                    distance: distance,
                    isCustom: false,
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
        setPetServices((prevServices) => {
          const customServices = prevServices.filter((service) => service.isCustom)
          const combinedServices = [...allServices, ...customServices]
          return combinedServices.sort((a, b) => (a.distance || 0) - (b.distance || 0))
        })
      } catch (error) {
        console.error("Error en la búsqueda:", error)
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
      if (lowerText.includes("clinic") || lowerText.includes("clinica")) {
        return "Clínica veterinaria"
      }
      if (lowerText.includes("hospital")) {
        return "Hospital veterinario"
      }
      return "Servicio para mascotas"
    }

    const getServiceColor = (category: string, isCustom = false): string => {
      if (isCustom) {
        return "text-orange-600 hover:text-orange-800"
      }

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
          return "text-gray-600 hover:text-gray-800"
      }
    }

    const getServiceIcon = (category: string, isCustom = false): string => {
      if (isCustom) {
        return "🐾"
      }

      switch (category.toLowerCase()) {
        case "veterinaria booster":
          return "🚀"
        case "veterinaria":
        case "clínica veterinaria":
        case "hospital veterinario":
          return "🏥"
        case "tienda de mascotas":
          return "🛒"
        case "peluquería":
          return "✂️"
        default:
          return "🐾"
      }
    }

    const getCategoryEmoji = (category: string): string => {
      switch (category.toLowerCase()) {
        case "veterinaria":
          return "🏥"
        case "peluqueria":
          return "✂️"
        case "tienda":
          return "🛒"
        case "guarderia":
          return "🏠"
        case "adiestramiento":
          return "🎓"
        case "adopcion":
          return "❤️"
        default:
          return "🐾"
      }
    }

    const calculateRoute = async (service: RealPetService) => {
      setLoadingRoute(true)

      try {
        const response = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/driving/${userLocation.lng},${userLocation.lat};${service.lng},${service.lat}?geometries=geojson&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`,
        )

        if (response.ok) {
          const data = await response.json()

          if (data.routes && data.routes.length > 0) {
            const route = data.routes[0]
            const duration = Math.round(route.duration / 60)
            const distance = (route.distance / 1000).toFixed(1)

            const updatedService = {
              ...service,
              routeDistance: `${distance} km`,
              routeDuration: `${duration} min`,
            }

            setPetServices((prevServices) => prevServices.map((s) => (s.id === service.id ? updatedService : s)))

            setSelectedService(null)

            setRouteInfo({
              distance: `${distance} km`,
              duration: `${duration} min`,
              service: updatedService,
            })

            setRouteGeometry({
              type: "Feature",
              properties: {},
              geometry: route.geometry,
            })

            toast.success(`Ruta: ${distance} km - ${duration} min`)
          }
        }
      } catch (error) {
        console.error("Error al calcular ruta:", error)
        toast.error("Error al calcular la ruta")
      } finally {
        setLoadingRoute(false)
      }
    }

    const clearRoute = () => {
      setRouteInfo(null)
      setRouteGeometry(null)
    }

    const handleMarkerClick = (service: RealPetService) => {
      if (selectedService && selectedService.id === service.id) {
        setSelectedService(null)
        setRouteInfo(null)
        setRouteGeometry(null)
      } else {
        setSelectedService(service)
        setRouteInfo(null)
        setRouteGeometry(null)
      }
    }

    const handleEditService = (service: RealPetService) => {
      if (onEditService) {
        onEditService(service)
      }
    }

    useEffect(() => {
      searchPetServices(userLocation.lat, userLocation.lng)
      fetchCustomServices()
    }, [userLocation])

    useEffect(() => {
      if (refreshTrigger && refreshTrigger > 0) {
        refreshServices()
      }
    }, [refreshTrigger])

    return (
      <>
        {(loading || customServicesLoading) && (
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg z-10">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
              <span className="text-sm text-gray-600">
                {loading ? "Buscando servicios..." : "Cargando servicios personalizados..."}
              </span>
            </div>
          </div>
        )}

        {routeInfo && (
          <div className="absolute bottom-4 left-4 bg-white backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-200 z-20 max-w-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-lg">
                    {getServiceIcon(routeInfo.service.category, routeInfo.service.isCustom)}
                  </span>
                  <h4
                    className="font-semibold text-gray-800 text-sm leading-tight break-words overflow-hidden"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      maxHeight: "2.5rem",
                    }}
                  >
                    {routeInfo.service.name}
                  </h4>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center text-sm text-blue-800 font-medium">
                    <span className="mr-2">🚗</span>
                    <span>
                      {routeInfo.distance} • {routeInfo.duration}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">La ruta se muestra en azul en el mapa</div>
                </div>
              </div>
              <button
                onClick={clearRoute}
                className="p-1 hover:bg-gray-100 rounded ml-2 flex-shrink-0"
                title="Cerrar ruta"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
        )}

        {routeGeometry && (
          <Source id="route" type="geojson" data={routeGeometry}>
            <Layer
              id="route"
              type="line"
              source="route"
              layout={{
                "line-join": "round",
                "line-cap": "round",
              }}
              paint={{
                "line-color": "#3b82f6",
                "line-width": 4,
                "line-opacity": 0.8,
              }}
            />
          </Source>
        )}

        {petServices.map((service) => (
          <Marker
            key={service.id}
            latitude={service.lat}
            longitude={service.lng}
            anchor="bottom"
            onClick={() => handleMarkerClick(service)}
          >
            <div className="cursor-pointer transform hover:scale-110 transition-transform">
              <div className="relative">
                <div
                  className={`w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold ${
                    service.isCustom ? "bg-orange-500" : "bg-gray-600"
                  }`}
                >
                  {getServiceIcon(service.category, service.isCustom)}
                </div>
                {selectedService && selectedService.id === service.id && (
                  <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-50"></div>
                )}
              </div>
            </div>
          </Marker>
        ))}

        {selectedService && (
          <Popup
            latitude={selectedService.lat}
            longitude={selectedService.lng}
            onClose={() => {
              setSelectedService(null)
              setRouteInfo(null)
              setRouteGeometry(null)
            }}
            closeOnClick={false}
            anchor="top"
            className="service-popup"
            maxWidth="320px"
          >
            <div className="bg-white p-4 space-y-3 max-w-[300px] rounded-lg shadow-lg border border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800 text-base flex items-center flex-wrap">
                    <span className="mr-2">{getServiceIcon(selectedService.category, selectedService.isCustom)}</span>
                    <span className="break-words">{selectedService.name}</span>
                  </h3>
                  {selectedService.isCustom && (
                    <span className="inline-block mt-2 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                      Servicio personalizado
                    </span>
                  )}
                </div>
                {selectedService.isCustom && onEditService && (
                  <button
                    onClick={() => handleEditService(selectedService)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Editar servicio"
                  >
                    <Edit className="w-4 h-4 text-gray-600" />
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {selectedService.isCustom && selectedService.categories && selectedService.categories.length > 0 ? (
                  <div className="flex items-start text-sm text-gray-600">
                    <Star className="w-4 h-4 mr-2 mt-0.5 text-yellow-500 flex-shrink-0" />
                    <div className="flex flex-wrap gap-1">
                      {selectedService.categories.map((category, index) => (
                        <span key={index} className="inline-flex items-center space-x-1">
                          <span>{getCategoryEmoji(category)}</span>
                          <span className="font-medium">{category}</span>
                          {index < selectedService.categories!.length - 1 && <span className="text-gray-400">•</span>}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center text-sm text-gray-600">
                    <Star className="w-4 h-4 mr-2 text-yellow-500 flex-shrink-0" />
                    <span className="font-medium break-words">{selectedService.category}</span>
                  </div>
                )}

                {selectedService.phone && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />
                    <a
                      href={`tel:${selectedService.phone}`}
                      className="font-medium text-blue-600 hover:text-blue-800 break-words"
                    >
                      {selectedService.phone}
                    </a>
                  </div>
                )}

                {selectedService.isCustom && selectedService.description && (
                  <div className="flex items-start text-sm text-gray-600">
                    <Info className="w-4 h-4 mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                    <span className="flex-1 break-words">{selectedService.description}</span>
                  </div>
                )}

                <div className="flex items-start text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                  <span className="flex-1 break-words">{selectedService.address}</span>
                </div>

                <div className="flex items-center text-sm font-semibold text-green-600">
                  <Navigation className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>{selectedService.distance} km de distancia</span>
                </div>

                {selectedService.routeDistance && selectedService.routeDuration && (
                  <div className="flex items-center text-sm font-semibold text-blue-600">
                    <Car className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>
                      {selectedService.routeDistance} • {selectedService.routeDuration} en auto
                    </span>
                  </div>
                )}

                {selectedService.isCustom && (
                  <div className="flex items-center text-sm text-orange-600">
                    <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>Agregado manualmente</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-gray-200">
                <button
                  onClick={() => calculateRoute(selectedService)}
                  disabled={loadingRoute}
                  className="inline-flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loadingRoute ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Calculando...
                    </>
                  ) : (
                    <>
                      <Navigation className="w-4 h-4 mr-2" />
                      {selectedService.routeDistance ? "Recalcular ruta" : "Mostrar ruta"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </Popup>
        )}
      </>
    )
  },
)

PetService.displayName = "PetService"

export default PetService

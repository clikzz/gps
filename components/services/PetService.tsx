"use client"

import { useState, useEffect, useImperativeHandle, forwardRef } from "react"
import { Marker, Source, Layer } from "react-map-gl/mapbox"
import { X } from "lucide-react"
import { toast } from "sonner"
import { ServiceDetailTabs } from "./ServiceDetail"
import { useUserProfile } from "@/stores/userProfile"

interface PetServiceProps {
  userLocation: { lat: number; lng: number }
  onEditService?: (service: RealPetService) => void
  refreshTrigger?: number
  onServiceDeleted?: () => void
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
  ({ userLocation, onEditService, refreshTrigger, onServiceDeleted }, ref) => {
    const { user } = useUserProfile()
    const [petServices, setPetServices] = useState<RealPetService[]>([])
    const [selectedService, setSelectedService] = useState<RealPetService | null>(null)
    const [customServicesLoading, setCustomServicesLoading] = useState(false)
    const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string; service: RealPetService } | null>(null)
    const [loadingRoute, setLoadingRoute] = useState(false)
    const [routeGeometry, setRouteGeometry] = useState<any>(null)
    const [showServiceDetail, setShowServiceDetail] = useState(false)

    const SEARCH_RADIUS_KM = 10

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
              description: service.description,
              phone: service.phone,
            }
          })

          setPetServices(customServices.sort((a, b) => (a.distance || 0) - (b.distance || 0)))
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

            if (selectedService && selectedService.id === service.id) {
              setSelectedService(updatedService)
            }

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
      setSelectedService(service)
      setShowServiceDetail(true)
      setRouteInfo(null)
      setRouteGeometry(null)
    }

    const handleCloseServiceDetail = () => {
      setShowServiceDetail(false)
      setSelectedService(null)
      setRouteInfo(null)
      setRouteGeometry(null)
    }

    const handleEditService = (service: RealPetService) => {
      if (onEditService) {
        onEditService(service)
      }
    }

    const handleDeleteService = () => {
      if (onServiceDeleted) {
        onServiceDeleted()
      }
      setSelectedService(null)
      setShowServiceDetail(false)
      refreshServices()
    }

    useEffect(() => {
      fetchCustomServices()
    }, [userLocation])

    useEffect(() => {
      if (refreshTrigger && refreshTrigger > 0) {
        refreshServices()
      }
    }, [refreshTrigger])

    return (
      <>
        {routeInfo && (
          <div className="absolute bottom-4 left-4 bg-white backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-200 z-20 max-w-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="font-semibold text-gray-800 text-sm leading-tight break-words overflow-hidden">
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
                <div className="w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold bg-secondary">
                  🐾
                </div>
                {selectedService && selectedService.id === service.id && (
                  <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-50"></div>
                )}
              </div>
            </div>
          </Marker>
        ))}

        {selectedService && showServiceDetail && (
          <div className="absolute top-0 left-0 h-full w-full md:w-96 z-50 bg-white shadow-2xl">
            <ServiceDetailTabs
              service={selectedService}
              onClose={handleCloseServiceDetail}
              onCalculateRoute={calculateRoute}
              onEditService={user?.role === "ADMIN" ? handleEditService : undefined}
              onDeleteService={user?.role === "ADMIN" ? handleDeleteService : undefined}
            />
          </div>
        )}
      </>
    )
  },
)

PetService.displayName = "PetService"

export default PetService

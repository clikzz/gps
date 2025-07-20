"use client"

import { useState, useRef } from "react"
import dynamic from "next/dynamic"
import "mapbox-gl/dist/mapbox-gl.css"
import { Marker, Popup, NavigationControl, FullscreenControl, ScaleControl } from "react-map-gl/mapbox"
import { CircleUserRound, MapPin, Navigation, Map as MapIcon } from "lucide-react"
import PetService, { type PetServiceRef } from "@/components/services/PetService"
import LoadingScreen from "@/components/LoadingScreen"

const MapGL = dynamic(() => import("react-map-gl/mapbox").then((mod) => mod.default), { ssr: false })

interface MapProps {
  userLocation: { lat: number; lng: number }
  isSelectingLocation?: boolean
  selectedServiceLocation?: { lat: number; lng: number } | null
  onLocationSelect?: (location: { lat: number; lng: number }) => void
  onEditService?: (service: any) => void
  refreshTrigger?: number
}

export default function Map({
  userLocation,
  isSelectingLocation = false,
  selectedServiceLocation = null,
  onLocationSelect,
  onEditService,
  refreshTrigger,
}: MapProps) {
  const [viewState, setViewState] = useState({
    latitude: userLocation.lat,
    longitude: userLocation.lng,
    zoom: 14,
  })

  const [showUserPopup, setShowUserPopup] = useState(false)
  const [mapLoaded, setMapLoaded] = useState(false)
  const petServiceRef = useRef<PetServiceRef>(null)

  const mapToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ""

  const toggleUserPopup = () => {
    setShowUserPopup(!showUserPopup)
  }

  const handleMapClick = (event: any) => {
    if (isSelectingLocation && onLocationSelect) {
      const { lng, lat } = event.lngLat
      onLocationSelect({ lat, lng })
    }
  }

  const goToUserLocation = () => {
    setViewState({
      latitude: userLocation.lat,
      longitude: userLocation.lng,
      zoom: 14,
    })
  }

  if (!mapToken) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100">
        <div className="text-center p-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Error de configuración</h3>
          <p className="text-gray-600">No se ha configurado el token de Mapbox.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full relative overflow-hidden">
      <MapGL
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapboxAccessToken={mapToken}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        style={{ width: "100%", height: "100%" }}
        onLoad={() => {
          setMapLoaded(true)
        }}
        onClick={handleMapClick}
        cursor={isSelectingLocation ? "crosshair" : "grab"}
        doubleClickZoom={!isSelectingLocation}
        scrollZoom={true}
        dragPan={true}
        dragRotate={true}
        keyboard={true}
        reuseMaps={true}
        preserveDrawingBuffer={true}
      >
          <NavigationControl position="top-right" />
          <FullscreenControl position="top-right" />
          <ScaleControl position="bottom-left" />

          <div className="absolute bottom-4 right-4 z-10">
            <div
              onClick={goToUserLocation}
              className="w-10 h-10 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-xl"
            >
              <Navigation className="w-5 h-5 text-gray-700 hover:text-black transition-colors" />
            </div>
          </div>

          <Marker latitude={userLocation.lat} longitude={userLocation.lng} anchor="bottom" onClick={toggleUserPopup}>
            <div className="cursor-pointer transform hover:scale-110 transition-transform">
              <div className="relative">
                <CircleUserRound
                  size={32}
                  className="text-gray-700 hover:text-black transition-colors drop-shadow-lg"
                />
                <div className="absolute inset-0 rounded-full bg-gray-400 animate-ping opacity-30"></div>
              </div>
            </div>
          </Marker>

          {selectedServiceLocation && (
            <Marker latitude={selectedServiceLocation.lat} longitude={selectedServiceLocation.lng} anchor="bottom">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <MapPin className="w-10 h-10 text-gray-700 drop-shadow-lg" fill="currentColor" />
                  <div className="absolute inset-0 rounded-full bg-gray-400 animate-ping opacity-30"></div>
                </div>
                <div className="text-xs text-gray-700 font-medium mt-1 bg-white px-2 py-1 rounded shadow">
                  Nuevo servicio
                </div>
              </div>
            </Marker>
          )}

          {showUserPopup && (
            <Popup
              latitude={userLocation.lat}
              longitude={userLocation.lng}
              onClose={() => setShowUserPopup(false)}
              closeOnClick={false}
              closeButton={true}
              anchor="top"
              className="user-popup"
            >
              <div className="p-3 text-center bg-white rounded-lg shadow-lg border">
                <h3 className="font-bold text-gray-800 text-base mb-2">📍 Tu ubicación actual</h3>
                <div className="text-sm text-gray-600 space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="font-medium">Latitud:</span>
                      <br />
                      {userLocation.lat.toFixed(6)}
                    </div>
                    <div>
                      <span className="font-medium">Longitud:</span>
                      <br />
                      {userLocation.lng.toFixed(6)}
                    </div>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-xs text-gray-500">Mostrando servicios para mascotas cercanos🐕</p>
                  </div>
                </div>
              </div>
            </Popup>
          )}

          {mapLoaded && !isSelectingLocation && (
            <PetService
              ref={petServiceRef}
              userLocation={userLocation}
              onEditService={onEditService}
              refreshTrigger={refreshTrigger}
            />
          )}
        </MapGL>

        {!mapLoaded && (
          <div className="absolute inset-0 z-50 bg-background">
            <LoadingScreen
              title="Cargando mapa"
              subtext="Preparando el mapa y los servicios cercanos para tu mascota"
              icon={MapIcon}
            />
          </div>
        )}
      </div>
    )
  }

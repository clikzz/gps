"use client"

import { useState, useCallback } from "react"
import dynamic from "next/dynamic"
import "mapbox-gl/dist/mapbox-gl.css"
import { Marker, NavigationControl, FullscreenControl, ScaleControl } from "react-map-gl/mapbox"
import { MapPin, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const MapGL = dynamic(() => import("react-map-gl/mapbox").then((mod) => mod.default), { ssr: false })

interface LocationPickerProps {
  userLocation: { lat: number; lng: number }
  selectedLocation?: { lat: number; lng: number } | null
  onLocationSelect: (location: { lat: number; lng: number }) => void
  onCancel?: () => void
  onConfirm?: () => void
  isSelecting: boolean
}

export default function LocationPicker({
  userLocation,
  selectedLocation,
  onLocationSelect,
  onCancel,
  onConfirm,
  isSelecting,
}: LocationPickerProps) {
  const [viewState, setViewState] = useState({
    latitude: selectedLocation?.lat || userLocation.lat,
    longitude: selectedLocation?.lng || userLocation.lng,
    zoom: 15,
  })

  const [mapLoaded, setMapLoaded] = useState(false)
  const mapToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ""

  if (!userLocation || typeof userLocation.lat !== "number" || typeof userLocation.lng !== "number") {
    return (
      <div className="h-64 w-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center p-4">
          <h3 className="text-lg font-semibold text-orange-600 mb-2">Ubicación no disponible</h3>
          <p className="text-gray-600">Por favor, permite el acceso a tu ubicación primero.</p>
        </div>
      </div>
    )
  }

  const handleMapClick = useCallback(
    (event: any) => {
      if (!isSelecting) return

      const { lng, lat } = event.lngLat
      onLocationSelect({ lat, lng })
    },
    [isSelecting, onLocationSelect],
  )

  if (!mapToken) {
    return (
      <div className="h-64 w-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center p-4">
          <h3 className="text-lg font-semibold text-red-600 mb-2">Error de configuración</h3>
          <p className="text-gray-600">No se ha configurado el token de Mapbox.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="w-full h-64 relative overflow-hidden rounded-lg border">
        <MapGL
          {...viewState}
          onMove={(evt) => setViewState(evt.viewState)}
          mapboxAccessToken={mapToken}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          style={{ width: "100%", height: "100%" }}
          onLoad={() => setMapLoaded(true)}
          onClick={handleMapClick}
          cursor={isSelecting ? "crosshair" : "grab"}
          doubleClickZoom={!isSelecting}
          scrollZoom={true}
          dragPan={true}
          dragRotate={false}
          keyboard={true}
        >
          <NavigationControl position="top-right" />
          <FullscreenControl position="top-right" />
          <ScaleControl position="bottom-left" />

          {/* Marcador de ubicación del usuario */}
          <Marker latitude={userLocation.lat} longitude={userLocation.lng} anchor="bottom">
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div className="text-xs text-blue-600 font-medium mt-1 bg-white px-1 rounded shadow">Tu ubicación</div>
            </div>
          </Marker>

          {/* Marcador de ubicación seleccionada */}
          {selectedLocation && (
            <Marker latitude={selectedLocation.lat} longitude={selectedLocation.lng} anchor="bottom">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <MapPin className="w-8 h-8 text-red-500 drop-shadow-lg" fill="currentColor" />
                  <div className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-30"></div>
                </div>
                <div className="text-xs text-red-600 font-medium mt-1 bg-white px-2 py-1 rounded shadow">
                  Ubicación del servicio
                </div>
              </div>
            </Marker>
          )}
        </MapGL>

        {!mapLoaded && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
              <p className="text-gray-600 text-sm">Cargando mapa...</p>
            </div>
          </div>
        )}

        {isSelecting && (
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-lg">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium text-gray-700">
                Haz clic en el mapa para seleccionar la ubicación
              </span>
            </div>
          </div>
        )}
      </div>

      {selectedLocation && (
        <div className="bg-gray-50 p-3 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Ubicación seleccionada:</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Latitud:</span>
              <div className="font-mono text-gray-800">{selectedLocation.lat.toFixed(6)}</div>
            </div>
            <div>
              <span className="text-gray-500">Longitud:</span>
              <div className="font-mono text-gray-800">{selectedLocation.lng.toFixed(6)}</div>
            </div>
          </div>
        </div>
      )}

      {isSelecting && (onCancel || onConfirm) && (
        <div className="flex space-x-2">
          {onCancel && (
            <Button variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
          )}
          {onConfirm && selectedLocation && (
            <Button onClick={onConfirm} className="flex-1">
              <Check className="w-4 h-4 mr-2" />
              Confirmar ubicación
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

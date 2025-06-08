"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import "mapbox-gl/dist/mapbox-gl.css"
import { Marker, Popup, NavigationControl, FullscreenControl, ScaleControl } from "react-map-gl/mapbox"
import { CircleUserRound } from "lucide-react"
import { toast } from "sonner"
import PetService from "./PetService"

const MapGL = dynamic(() => import("react-map-gl/mapbox").then((mod) => mod.default), { ssr: false })

interface MapProps {
  userLocation: { lat: number; lng: number }
}

export default function Map({ userLocation }: MapProps) {
  const [viewState, setViewState] = useState({
    latitude: userLocation.lat,
    longitude: userLocation.lng,
    zoom: 14,
  })

  const [showUserPopup, setShowUserPopup] = useState(false)
  const [mapLoaded, setMapLoaded] = useState(false)

  const mapToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN_SERVICES || ""

  console.log("Renderizando mapa con ubicación:", userLocation)

  if (!mapToken) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100">
        <div className="text-center p-8">
          <h3 className="text-lg font-semibold text-red-600 mb-2">Error de configuración</h3>
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
          toast.success("Mapa cargado correctamente")
        }}
        onError={(error) => {
          console.error("Error del mapa:", error)
          toast.error("Error al cargar el mapa")
        }}
        doubleClickZoom={true}
        scrollZoom={true}
        dragPan={true}
        dragRotate={true}
        keyboard={true}
        touchZoom={true}
        touchRotate={true}
        reuseMaps={true}
        preserveDrawingBuffer={true}
      >
        <NavigationControl position="top-right" />
        <FullscreenControl position="top-right" />
        <ScaleControl position="bottom-left" />
        <Marker
          latitude={userLocation.lat}
          longitude={userLocation.lng}
          anchor="bottom"
          onClick={() => setShowUserPopup(true)}
        >
          <div className="cursor-pointer transform hover:scale-110 transition-transform">
            <div className="relative">
              <CircleUserRound
                size={32}
                className="text-purple-600 hover:text-purple-800 transition-colors drop-shadow-lg"
              />
              <div className="absolute inset-0 rounded-full bg-purple-400 animate-ping opacity-30"></div>
            </div>
          </div>
        </Marker>
        {showUserPopup && (
          <Popup
            latitude={userLocation.lat}
            longitude={userLocation.lng}
            onClose={() => setShowUserPopup(false)}
            closeOnClick={false}
            anchor="top"
            className="user-popup"
          >
            <div className="p-4 space-y-3 min-w-[250px]">
              <h3 className="font-bold text-purple-700 flex items-center text-base">📍 Tu ubicación actual</h3>
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
                  <p className="text-xs text-gray-500">🐕 Buscando servicios para mascotas cercanos...</p>
                </div>
              </div>
            </div>
          </Popup>
        )}
        {mapLoaded && <PetService userLocation={userLocation} />}
      </MapGL>
      <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg text-sm text-gray-700 max-w-xs hidden md:block border border-gray-200">
        <h4 className="font-semibold mb-2 text-purple-700">🗺️ Controles del mapa</h4>
        <ul className="space-y-1 text-xs">
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
            Arrastra para mover el mapa
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
            Rueda del mouse para zoom
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
            Doble clic para zoom rápido
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
            Clic en marcadores para info
          </li>
        </ul>
      </div>
      {!mapLoaded && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando mapa...</p>
          </div>
        </div>
      )}
    </div>
  )
}

"use client";

import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import "mapbox-gl/dist/mapbox-gl.css";
import type { MapRef } from "react-map-gl/mapbox";
import { Marker } from "react-map-gl/mapbox";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface LatLng {
  lat: number;
  lng: number;
}

interface LocationPickerProps {
  initial?: LatLng;
  open: boolean;
  onClose: () => void;
  onSelect: (loc: LatLng) => void;
}

const Map = dynamic(
  () => import("react-map-gl/mapbox").then((mod) => mod.default),
  { ssr: false }
);

export default function LocationPicker({
  initial = { lat: 0, lng: 0 },
  open,
  onClose,
  onSelect,
}: LocationPickerProps) {
  const mapRef = useRef<MapRef | null>(null);
  const [picked, setPicked] = useState<LatLng | null>(null);

  useEffect(() => {
    if (open && mapRef.current) {
      mapRef.current.flyTo({
        center: [initial.lng, initial.lat],
        zoom: 12,
      });
      setPicked(null);
    }
  }, [open, initial]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="fixed flex items-center justify-center p-4 z-50 lg:max-w-7xl">
        <div className="w-full flex flex-col overflow-hidden h-[80vh]">
          <DialogHeader className="border-b px-4 py-2">
            <DialogTitle>Elige ubicación</DialogTitle>
          </DialogHeader>

          <div className="flex-1">
            <Map
              ref={mapRef}
              mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
              initialViewState={{
                latitude: initial.lat,
                longitude: initial.lng,
                zoom: 12,
              }}
              mapStyle="mapbox://styles/mapbox/streets-v12"
              onClick={(e) => {
                const [lng, lat] = e.lngLat.toArray();
                setPicked({ lat, lng });
              }}
            >
              {picked && (
                <Marker longitude={picked.lng} latitude={picked.lat} anchor="bottom">
                  <MapPin className="text-red-600" size={28} />
                </Marker>
              )}
            </Map>
          </div>

          <div className="border-t p-4 flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={() => picked && onSelect(picked)} disabled={!picked}>
              Confirmar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

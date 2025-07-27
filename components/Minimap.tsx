"use client";

import React, { useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import "mapbox-gl/dist/mapbox-gl.css";
import type { MapRef } from "react-map-gl/mapbox";
import { Marker } from "react-map-gl/mapbox";
import { MapPin } from "lucide-react";

export interface LatLng {
  lat: number;
  lng: number;
}

interface MinimapProps {
  location: LatLng;
  width?: string;
  height?: string;
  zoom?: number;
}

const Map = dynamic(
  () => import("react-map-gl/mapbox").then((mod) => mod.default),
  { ssr: false }
);

export function Minimap({
  location,
  width = "100%",
  height = "200px",
  zoom = 13,
}: MinimapProps) {
  const mapRef = useRef<MapRef | null>(null);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [location.lng, location.lat],
        zoom,
        duration: 500,
      });
    }
  }, [location, zoom]);

  return (
    <div style={{ width, height, borderRadius: 10, overflow: "hidden" }}>
      <Map
        ref={mapRef}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        initialViewState={{
          latitude: location.lat,
          longitude: location.lng,
          zoom,
        }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        interactive={false}
        attributionControl={false}
        style={{ width: "100%", height: "100%" }}
      >
        <Marker
          longitude={location.lng}
          latitude={location.lat}
          anchor="bottom"
        >
          <MapPin size={28} className="text-secondary drop-shadow-lg" fill="currentColor" />
        </Marker>
      </Map>
    </div>
  );
}

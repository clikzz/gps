'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Marker, Popup } from 'react-map-gl/mapbox';
import { useUserLocation } from '@/hooks/useUserLocation';
import { CircleUserRound } from 'lucide-react';

const Map = dynamic(
  () => import('react-map-gl/mapbox').then((mod) => mod.default),
  { ssr: false }
);

export default function LostPetsMap() {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const { initial, error, onMapLoad } = useUserLocation();

  return (
    <div className="relative w-full h-full">
      {error && (
        <div className="absolute top-2 left-2 bg-red-500 text-white p-2 rounded">
          {error}
        </div>
      )}

      <Map
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN!}
        initialViewState={{
          latitude: initial.latitude,
          longitude: initial.longitude,
          zoom: initial.zoom
        }}
        mapStyle="mapbox://styles/mapbox/outdoors-v11"
        style={{ width: '100%', height: '100%' }}
        onLoad={evt => {
          const map = evt.target;
          mapRef.current = map;
          onMapLoad(map);
        }}
      >
        <Marker
          latitude={initial.latitude}
          longitude={initial.longitude}
          anchor="bottom"
        >
          <CircleUserRound
            size={28}
            className="text-blue-500"
          />
        </Marker>
      </Map>
    </div>
  );
}
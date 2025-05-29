'use client';

import React, { useState, useEffect, useRef, use } from 'react';
import dynamic from 'next/dynamic';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Marker, Popup } from 'react-map-gl/mapbox';
import { useUserLocation } from '@/hooks/useUserLocation';
import { CircleUserRound, Dog } from 'lucide-react';

const Map = dynamic(
  () => import('react-map-gl/mapbox').then((mod) => mod.default),
  { ssr: false }
);

interface MissingReport {
  id: string;
  pet_id: string;
  reporter_id: string;
  latitude: number;
  longitude: number;
  photo_url: string;
  description?: string;
  reported_at: string;
  pet: { id: string; name: string };
  reporter: { id: string; name: string };
}

export default function FindMap() {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const { initial, error, onMapLoad } = useUserLocation();

  const [reports, setReports] = useState<MissingReport[]>([]);
  const [selected, setSelected] = useState<MissingReport | null>(null);

  useEffect(() => {
    fetch('/api/find-my-pet/recent')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: MissingReport[]) => {
        setReports(data);
      })
      .catch(console.error);
  }, []);

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

        {/* Marcadores de mascotas reportadas */}
        {reports.map((r) => (
          <Marker
            key={r.id}
            latitude={r.latitude}
            longitude={r.longitude}
            anchor="bottom"
            onClick={() => setSelected(r)}
          >
            <Dog
              size={28}
              className="text-yellow-900 cursor-pointer"
            />
          </Marker>
        ))}

        {/* Popup para mostrar detalles de la mascota */}
        {selected && (
          <Popup
            latitude={selected.latitude}
            longitude={selected.longitude}
            onClose={() => setSelected(null)}
            closeOnClick={false}
            anchor="top"
          >
            <div className="space-y-2">
              <h3 className="font-bold">🐾 {selected.pet.name}</h3>
              <p className="text-sm text-black">Reportado por: {selected.reporter.name}</p>
              <img
                src={selected.photo_url}
                alt={selected.pet.name}
                className="w-full h-24 object-cover rounded"
              />
              {selected.description && (
                <p className="text-xs text-black">{selected.description}</p>
              )}
              <p className="text-xs text-black">
                {new Date(selected.reported_at).toLocaleString()}
              </p>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
'use client';

import React, { useState, useEffect, useRef, use } from 'react';
import dynamic from 'next/dynamic';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Marker, Popup } from 'react-map-gl/mapbox';
import { useUserLocation } from '@/hooks/useUserLocation';
import { CircleUserRound, Dog, MapPinCheck } from 'lucide-react';
import ActionsMenu from '@/components/find/ActionsMenu';
import ReportModal, { LatLng } from '@/components/find/ReportModal';
import MyReports from '@/components/find/MyReports';
import OthersReports from '@/components/find/OthersReports';

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
  pet: { id: string; name: string; photo_url?: string };
  reporter: { id: string; name: string };
}

export default function FindMap() {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const { initial, error, onMapLoad } = useUserLocation();

  const [reports, setReports] = useState<MissingReport[]>([]);
  const [selected, setSelected] = useState<MissingReport | null>(null);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isMyReportsModalOpen, setIsMyReportsModalOpen] = useState(false);
  const [isOthersReportsModalOpen, setIsOthersReportsModalOpen] = useState(false);

  const [pickLocationMode, setPickLocationMode] = useState(false);
  const [pickedLocation, setPickedLocation] = useState<LatLng | null>(null);

  useEffect(() => {
    refreshReports();
  }, []);

  const refreshReports = () => {
    fetch('/api/find?mode=recent')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: MissingReport[]) => {
        setReports(data);
      })
      .catch(console.error);
  };

  const handleSubmitReport = async (data: {
    pet_id: string;
    description?: string;
    photo_urls?: string[];
    location?: LatLng;
  }) => {
    if (!mapRef.current) {
      alert('El mapa no está listo aún.');
      return;
    }

    let lat: number, lng: number;
    if (data.location) {
      lat = data.location.lat;
      lng = data.location.lng;
    } else {
      const center = mapRef.current.getCenter();
      lat = center.lat;
      lng = center.lng;
    }

    const payload = {
      pet_id: data.pet_id,
      latitude: lat,
      longitude: lng,
      photo_urls: data.photo_urls,
      description: data.description,
    };

    try {
      const res = await fetch('/api/find', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Error al enviar reporte');
      }
      setIsReportModalOpen(false);
      setPickedLocation(null);
      refreshReports();
    } catch (err: any) {
      console.error(err);
      alert('No se pudo enviar el reporte. Intenta de nuevo.');
    }
  };

  const handlePickLocation = () => {
    setIsReportModalOpen(false);
    setPickLocationMode(true);
    alert('Haz clic en el mapa para seleccionar la ubicación definitiva.');
  };

  const handleMapClick = (evt: any) => {
    if (!pickLocationMode) return;
    const [lng, lat] = evt.lngLat.toArray();
    setPickedLocation({ lat, lng });
    setPickLocationMode(false);
    setIsReportModalOpen(true);
  };

  return (
    <div className="relative w-full h-full">
      {error && (
        <div className="absolute top-2 left-2 bg-red-500 p-2 rounded">
          {error}
        </div>
      )}

      <div className="absolute top-4 right-4 z-20">
        <ActionsMenu
          onReportClick={() => setIsReportModalOpen(true)}
          onMyReportsClick={() => setIsMyReportsModalOpen(true)}
          onOthersReportsClick={() => setIsOthersReportsModalOpen(true)}
        />
      </div>

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => {
          setIsReportModalOpen(false);
          setPickLocationMode(false);
          setPickedLocation(null);
        }}
        onSubmit={handleSubmitReport}
        onPickLocation={handlePickLocation}
        pickedLocation={pickedLocation}
      />

      <MyReports
        isOpen={isMyReportsModalOpen}
        onClose={() => setIsMyReportsModalOpen(false)}
      />

      <OthersReports
        isOpen={isOthersReportsModalOpen}
        onClose={() => setIsOthersReportsModalOpen(false)}
      />

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
        onClick={(evt) => handleMapClick(evt)}
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
            {r.pet.photo_url ? (
              <img
                src={r.pet.photo_url}
                alt={r.pet.name}
                className="w-12 h-12 rounded-full border-2 border-white shadow-lg cursor-pointer"
              />
            ) : (
              <Dog size={28} className="text-yellow-900 cursor-pointer" />
            )}
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
              {/* Foto de perfil */}
              {selected.pet.photo_url && (
                <img
                  src={selected.pet.photo_url}
                  alt={selected.pet.name}
                  className="w-16 h-16 object-cover rounded-full mx-auto"
                />
              )}
              <h3 className="font-bold text-center">🐾 {selected.pet.name}</h3>
              <p className="text-sm text-black text-center">
                Reportado por: {selected.reporter.name}
              </p>

              {/* Fotos de respaldo */}
              <img
                src={selected.photo_url}
                alt={`${selected.pet.name} (reporte)`}
                className="w-full h-24 object-cover rounded"
              />

              {selected.description && (
                <p className="text-xs text-black">{selected.description}</p>
              )}
              <p className="text-xs text-black text-right">
                {new Date(selected.reported_at).toLocaleString()}
              </p>
            </div>
          </Popup>
        )}

        {pickedLocation && (
          <Marker
            latitude={pickedLocation.lat}
            longitude={pickedLocation.lng}
            anchor="bottom"
          >
            <MapPinCheck
              size={28}
              className="text-red-500"
            />
          </Marker>
        )}
      </Map>
    </div>
  );
}
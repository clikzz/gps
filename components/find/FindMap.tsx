"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import "mapbox-gl/dist/mapbox-gl.css";
import { Marker } from "react-map-gl/mapbox";
import { MissingReport } from "@/types/find";
import { useUserLocation } from "@/hooks/useUserLocation";
import { Circle, MapPinCheck } from "lucide-react";
import ActionsMenu from "@/components/find/ActionsMenu";
import ReportModal, { LatLng } from "@/components/find/ReportModal";
import MyReports from "@/components/find/MyReports";
import OthersReports from "@/components/find/OthersReports";
import MapMarkers from "@/components/find/MapMarkers";
import ReportPopup from "@/components/find/MapPopups";

const Map = dynamic(
  () => import("react-map-gl/mapbox").then((mod) => mod.default),
  { ssr: false }
);

export default function FindMap() {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const { initial, error, onMapLoad } = useUserLocation();

  const [reports, setReports] = useState<MissingReport[]>([]);
  const [selected, setSelected] = useState<MissingReport | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isMyReportsModalOpen, setIsMyReportsModalOpen] = useState(false);
  const [isOthersReportsModalOpen, setIsOthersReportsModalOpen] =
    useState(false);

  const [pickLocationMode, setPickLocationMode] = useState(false);
  const [pickedLocation, setPickedLocation] = useState<LatLng | null>(null);

  useEffect(() => {
    setPhotoIndex(0);
  }, [selected]);

  useEffect(() => {
    refreshReports();
  }, []);

  function refreshReports() {
    fetch("/api/find?mode=recent")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: MissingReport[]) => setReports(data))
      .catch(console.error);
  }

  async function handleSubmitReport(data: {
    pet_id: string;
    description?: string;
    photo_urls?: string[];
    location?: LatLng;
  }) {
    if (!mapRef.current) return alert("El mapa no está listo aún.");

    const [lat, lng] = data.location
      ? [data.location.lat, data.location.lng]
      : (() => {
          const c = mapRef.current!.getCenter();
          return [c.lat, c.lng];
        })();

    const payload = {
      pet_id: parseInt(data.pet_id, 10),
      latitude: lat,
      longitude: lng,
      photo_urls: data.photo_urls,
      description: data.description,
    };

    try {
      const res = await fetch("/api/find", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        const msg =
          typeof err.error === "string"
            ? err.error
            : JSON.stringify(err.error || err);
        throw new Error(msg);
      }
      setIsReportModalOpen(false);
      setPickedLocation(null);
      refreshReports();
    } catch (e: any) {
      console.error("Error al enviar reporte:", e);
      alert(`Error al enviar reporte: ${e.message}`);
    }
  }

  function handlePickLocation() {
    setIsReportModalOpen(false);
    setPickLocationMode(true);
    alert("Haz clic en el mapa para seleccionar la ubicación definitiva.");
  }

  function handleMapClick(evt: any) {
    if (!pickLocationMode) return;
    const [lng, lat] = evt.lngLat.toArray();
    setPickedLocation({ lat, lng });
    setPickLocationMode(false);
    setIsReportModalOpen(true);
  }

  return (
    <div className="relative w-full h-full">
      {error && (
        <div className="absolute top-2 left-2 bg-red-500 p-2 rounded text-white">
          {error}
        </div>
      )}

      {/* Menú de acciones */}
      <div className="absolute top-4 right-4 z-20">
        <ActionsMenu
          onReportClick={() => setIsReportModalOpen(true)}
          onMyReportsClick={() => setIsMyReportsModalOpen(true)}
          onOthersReportsClick={() => setIsOthersReportsModalOpen(true)}
        />
      </div>

      {/* Modales */}
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

      {/* Mapa */}
      <Map
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN!}
        initialViewState={{
          latitude: initial.latitude,
          longitude: initial.longitude,
          zoom: initial.zoom,
        }}
        mapStyle="mapbox://styles/mapbox/outdoors-v11"
        style={{ width: "100%", height: "100%" }}
        onLoad={(e) => {
          mapRef.current = e.target;
          onMapLoad(e.target);
        }}
        onClick={handleMapClick}
      >
        <Marker
          latitude={initial.latitude}
          longitude={initial.longitude}
          anchor="bottom"
        >
          <Circle size={22} className="text-blue-600" />
        </Marker>

        {/* Marcadores */}
        <MapMarkers
          reports={reports}
          onSelect={(report) => setSelected(report)}
        />

        {/* Popup */}
        <ReportPopup
          selected={selected}
          photoIndex={photoIndex}
          setPhotoIndex={setPhotoIndex}
          onClose={() => setSelected(null)}
        />

        {/* Marcador de ubicación marcada */}
        {pickedLocation && (
          <Marker
            latitude={pickedLocation.lat}
            longitude={pickedLocation.lng}
            anchor="bottom"
          >
            <MapPinCheck size={28} className="text-red-500" />
          </Marker>
        )}
      </Map>
    </div>
  );
}

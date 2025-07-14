"use client";

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Marker } from 'react-map-gl/mapbox';
import { useUserProfile } from '@/stores/userProfile';
import { MissingReport, FoundReport } from '@/types/find';
import { useUserLocation } from '@/hooks/useUserLocation';
import { MapPin, Plus, Minus, Compass } from 'lucide-react';
import ActionsMenu from '@/components/find/ActionsMenu';
import ReportModal, { LatLng } from '@/components/find/ReportModal';
import MyReports from '@/components/find/MyReports';
import OthersReports from '@/components/find/OthersReports';
import FoundReportModal from '@/components/find/FoundReportModal';
import { Markers } from '@/components/find/FindMarkers';
import ReportPopup from '@/components/find/ReportPopup';
import FoundReports from '@/components/find/FoundReports';
import FoundPopup from '@/components/find/FoundPopup';
import { toast } from "sonner";
import { fetcher } from "@/lib/utils";

const Map = dynamic(
  () => import("react-map-gl/mapbox").then((mod) => mod.default),
  { ssr: false }
);

export default function FindMap() {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const { initial, error, onMapLoad } = useUserLocation();

  const userId = useUserProfile((state) => state.user?.id || "");

  const [reports, setReports] = useState<MissingReport[]>([]);
  const [selected, setSelected] = useState<MissingReport | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isMyReportsModalOpen, setIsMyReportsModalOpen] = useState(false);
  const [isOthersReportsModalOpen, setIsOthersReportsModalOpen] = useState(false);
  const [isFoundReportsModalOpen, setIsFoundReportsModalOpen] = useState(false);

  const [pickLocationMode, setPickLocationMode] = useState(false);
  const [pickedLocation, setPickedLocation] = useState<LatLng | null>(null);

  const [isFoundModalOpen, setIsFoundModalOpen] = useState(false);
  const [targetReport, setTargetReport] = useState<MissingReport | null>(null);

  const [foundPickMode, setFoundPickMode] = useState(false);
  const [foundLocation, setFoundLocation] = useState<LatLng | null>(null);

  const [foundReportsOnMap, setFoundReportsOnMap] = useState<FoundReport[]>([]);
  const [foundSelected, setFoundSelected] = useState<FoundReport | null>(null);
  const [foundPhotoIndex, setFoundPhotoIndex] = useState(0);

  async function refreshReports() {
    try {
      const data = await fetcher<MissingReport[]>("/api/find?mode=recent");
      setReports(data);
    } catch (err: any) {
      console.error("Error fetching recent reports:", err);
    }
  }

  async function refreshFoundReports() {
    try {
      const data = await fetcher<FoundReport[]>("/api/find?mode=found");
      setFoundReportsOnMap(data);
    } catch (err: any) {
      console.error("Error fetching found reports:", err);
    }
  }

  useEffect(() => {
    setPhotoIndex(0);
  }, [selected]);

  useEffect(() => {
    refreshReports();
    refreshFoundReports();
  }, []);

  const flyToReport = (report: MissingReport) => {
    if (!mapRef.current) return;
    mapRef.current.flyTo({
      center: [report.longitude, report.latitude],
      zoom: 16,
      essential: true,
      speed: 1.2,
    });
  };

  const handleGoTo = (report: MissingReport) => {
    setIsOthersReportsModalOpen(false);
    setIsMyReportsModalOpen(false);
    flyToReport(report);
  };

  function openFoundModal(report: MissingReport) {
    setTargetReport(report);
    setIsFoundModalOpen(true);
    setFoundLocation(null);
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
      toast.error(`Error al enviar reporte: ${e.message}`);
    }
  }

  function handlePickLocation() {
    setIsReportModalOpen(false);
    setPickLocationMode(true);
    toast.info("Selecciona en el mapa la última ubicación de tu mascota.");
  }

  function handleMapClick(evt: any) {
    const [lng, lat] = evt.lngLat.toArray();
    if (pickLocationMode) {
      setPickedLocation({ lat, lng });
      setPickLocationMode(false);
      setIsReportModalOpen(true);
    }
    if (foundPickMode) {
      setFoundLocation({ lat, lng });
      setFoundPickMode(false);
      setIsFoundModalOpen(true);
    }
  }

  const handleZoomIn = () => {
    if (!mapRef.current) return;
    mapRef.current.zoomIn({ duration: 300 });
  };

  const handleZoomOut = () => {
    if (!mapRef.current) return;
    mapRef.current.zoomOut({ offset: [80, 60], duration: 300 });
  };

  const handleCenter = () => {
    if (!mapRef.current) return;
    mapRef.current.flyTo({
      center: [initial.longitude, initial.latitude],
      zoom: initial.zoom,
      essential: true,
      speed: 1.2,
    });
  };

  return (
    <div className="w-full h-full relative overflow-hidden">
      {error && (
        <div className="absolute top-2 left-2 bg-red-500 p-2 rounded text-white">
          {error}
        </div>
      )}

      {/* Menú de acciones */}
      <div className="absolute top-6 right-4 z-20">
        <ActionsMenu
          onReportClick={() => setIsReportModalOpen(true)}
          onMyReportsClick={() => setIsMyReportsModalOpen(true)}
          onOthersReportsClick={() => setIsOthersReportsModalOpen(true)}
          onFoundReportsClick={() => setIsFoundReportsModalOpen(true)}
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
        onGoTo={handleGoTo}
      />
      <OthersReports
        isOpen={isOthersReportsModalOpen}
        onClose={() => setIsOthersReportsModalOpen(false)}
        onGoTo={handleGoTo}
      />
      <FoundReports
        isOpen={isFoundReportsModalOpen}
        onClose={() => setIsFoundReportsModalOpen(false)}
      />

      {/* Mapa */}
      <Map
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN!}
        initialViewState={{
          latitude: initial.latitude,
          longitude: initial.longitude,
          zoom: initial.zoom,
        }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        style={{ width: "100%", height: "100%" }}
        onLoad={(e) => {
          mapRef.current = e.target;
          onMapLoad(e.target);
        }}
        onClick={handleMapClick}
      >

        {/* Marcadores de desapariciones */}
        <Markers
          reports={reports}
          onSelect={(r) => {
            setSelected(r);
            setFoundSelected(null);
          }}
        />

        {/* Marcadores de hallazgos */}
        <Markers
          key="found-markers"
          reports={foundReportsOnMap}
          variant="found"
          onSelect={(r) => {
            setFoundPhotoIndex(0);
            setFoundSelected(r);
            setSelected(null);
          }}
        />

        {/* Popup */}
        <ReportPopup
          selected={selected}
          userId={userId}
          photoIndex={photoIndex}
          setPhotoIndex={setPhotoIndex}
          onClose={() => setSelected(null)}
          onFound={() => {
            setSelected(null);
            refreshReports();
          }}
          onOpenFoundModal={openFoundModal}
        />

        {foundSelected && (
          <FoundPopup
            selected={foundSelected}
            userId={userId}
            photoIndex={foundPhotoIndex}
            setPhotoIndex={setFoundPhotoIndex}
            onClose={() => setFoundSelected(null)}
            onMarkResolved={(petId) => {
              refreshReports();
              refreshFoundReports();
            }}
          />
        )}

      {targetReport && (
        <FoundReportModal
          isOpen={isFoundModalOpen}
          report={targetReport}
          pickedLocation={foundLocation}
          onPickLocation={() => {
            setIsFoundModalOpen(false);
            setFoundPickMode(true);
          }}
          onClose={() => {
            setIsFoundModalOpen(false);
            setFoundLocation(null);
          }}
          onSubmitted={() => {
            setIsFoundModalOpen(false);
            setFoundLocation(null);
            toast.success("Se ha reportado el hallazgo correctamente.");
            refreshReports();
          }}
        />
      )}

        {/* Marcador de ubicación marcada */}
        {pickedLocation && (
          <Marker
            latitude={pickedLocation.lat}
            longitude={pickedLocation.lng}
            anchor="bottom"
          >
            <MapPin size={28} className="text-red-400 drop-shadow-lg" fill="currentColor" />
          </Marker>
        )}
      </Map>

        <div className="absolute bottom-6 right-4 flex flex-col space-y-2 z-20">
          <button
            onClick={handleZoomIn}
            className="p-2 bg-white rounded shadow hover:bg-gray-100"
          >
            <Plus size={20} />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 bg-white rounded shadow hover:bg-gray-100"
          >
            <Minus size={20} />
          </button>
          <button
            onClick={handleCenter}
            className="p-2 bg-white rounded shadow hover:bg-gray-100"
          >
            <Compass size={20} />
          </button>
        </div>
    </div>
  );
}

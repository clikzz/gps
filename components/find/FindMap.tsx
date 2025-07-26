"use client";

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Marker } from 'react-map-gl/mapbox';
import { useUserProfile } from '@/stores/userProfile';
import { MissingReport, FoundReport } from '@/types/find';
import { useUserLocation } from '@/hooks/useUserLocation';
import { MapPin, Plus, Minus, Compass, Search } from 'lucide-react';
import ActionsMenu from '@/components/find/ActionsMenu';
import ReportModal, { LatLng } from '@/components/find/ReportModal';
import MyReports from '@/components/find/MyReports';
import OthersReports from '@/components/find/OthersReports';
import FoundReportModal from '@/components/find/FoundReportModal';
import { Markers } from '@/components/find/FindMarkers';
import FoundReports from '@/components/find/FoundReports';
import PetReportCard from "@/components/find/PetReportCard"
import PetReportDialog from "@/components/find/PetReportDialog"
import FoundReportCard from "@/components/find/FoundReportCard"
import FoundReportDialog from "@/components/find/FoundReportDialog"
import LoadingScreen from "@/components/LoadingScreen";
import { toast } from "sonner";
import { fetcher } from "@/lib/utils";

const Map = dynamic(
  () => import("react-map-gl/mapbox").then((mod) => mod.default),
  { ssr: false }
);

export default function FindMap() {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const { initial, onMapLoad } = useUserLocation();

  const userId = useUserProfile((state) => state.user?.id || "");

  const [mapLoaded, setMapLoaded] = useState(false);

  const [reports, setReports] = useState<MissingReport[]>([]);

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

  const [selectedReport, setSelectedReport] = useState<MissingReport | null>(null);
  const [showCard, setShowCard] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [foundShowCard,   setFoundShowCard] = useState(false)
  const [foundShowDialog, setFoundShowDialog] = useState(false)

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
    refreshReports();
    refreshFoundReports();
  }, []);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768)
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  const flyToReport = (report: MissingReport) => {
    if (!mapRef.current) return;
    mapRef.current.flyTo({
      center: [report.longitude, report.latitude],
      zoom: 16,
      essential: true,
      speed: 1.2,
    });
  };

  const projectToPct = (lng: number, lat: number) => {
    if (!mapRef.current) return { xPct: 50, yPct: 50 }
    const { x, y } = mapRef.current.project([lng, lat])
    return { xPct: (x / window.innerWidth) * 100, yPct: (y / window.innerHeight) * 100 }
  }

  const handleGoTo = (report: MissingReport) => {
    setIsOthersReportsModalOpen(false);
    setIsMyReportsModalOpen(false);
    flyToReport(report);
  };

  const handleMarkerSelect = (r: MissingReport) => {
    setSelectedReport(r)
    setFoundSelected(null)

    if (isMobile) {
      setShowDialog(true)
      setShowCard(false)
    } else {
      setShowCard(true)
      setShowDialog(false)
    }
  }

  const handleFoundMarkerSelect = (r: FoundReport) => {
    setFoundSelected(r)
    setSelectedReport(null)

    if (isMobile) {
      setFoundShowDialog(true)
      setFoundShowCard(false)
    } else {
      setFoundShowCard(true)
      setFoundShowDialog(false)
    }
  }

  const markFoundResolved = async (r: FoundReport) => {
    try {
      const res = await fetch(`/api/find?mode=resolved&pet=${r.pet.id}`, {
        method: "PUT",
      })
      if (!res.ok) throw new Error("No se pudo marcar como encontrada.")
      toast.success("Mascota marcada como encontrada.")
      setFoundShowDialog(false)
      setFoundShowCard(false)
      setFoundSelected(null)
      refreshReports()
      refreshFoundReports()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

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
    if (!mapRef.current) return toast.error("El mapa no está listo aún.");

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
      toast.error(e.message);
    }
  }

  const markMissingResolved = async (r: MissingReport) => {
    try {
      const petId = parseInt(r.pet.id, 10)
      const res = await fetch(`/api/find?mode=resolved&pet=${petId}`, {
        method: "PUT",
      })
      if (!res.ok) throw new Error("No se pudo marcar como encontrada.")
      toast.success("Mascota marcada como encontrada.")
      setShowDialog(false)
      setShowCard(false)
      setSelectedReport(null)
      refreshReports()
      refreshFoundReports()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  function handlePickLocation() {
    setIsReportModalOpen(false);
    setPickLocationMode(true);
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

      {/* Indicador de modo selección */}
      {(pickLocationMode || foundPickMode) && (
        <div className="absolute top-4 left-4 z-30 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-600 rounded-full animate-pulse" />
            <div>
              <h3 className="font-semibold text-gray-800">Modo selección activo</h3>
              <p className="text-sm text-gray-700">
                {pickLocationMode
                  ? "Haz clic en el mapa para seleccionar la última ubicación de tu mascota"
                  : "Haz clic en el mapa para indicar dónde viste la mascota"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mapa */}
      <Map
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN!}
        initialViewState={initial}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        style={{ width: "100%", height: "100%" }}
        onLoad={(e) => {
          mapRef.current = e.target;
          onMapLoad(e.target);
          setMapLoaded(true);
        }}
        onClick={handleMapClick}
      >

        {/* Marcadores de desapariciones */}
        <Markers
          reports={reports}
          onSelect={handleMarkerSelect}
        />

        {/* Marcadores de hallazgos */}
        <Markers
          key="found-markers"
          reports={foundReportsOnMap}
          variant="found"
          onSelect={handleFoundMarkerSelect}
        />

        {foundShowCard && foundSelected && !isMobile && (
          <FoundReportCard
            report={foundSelected}
            screenXY={projectToPct(foundSelected.longitude, foundSelected.latitude)}
            meIsReporter={foundSelected.ownerId === userId}
            onViewDetails={() => {
              setFoundShowDialog(true)
              setFoundShowCard(false)
            }}
            onMarkResolved={markFoundResolved}
            onClose={() => {
              setFoundShowCard(false)
              setFoundSelected(null)
            }}
          />
        )}

        <FoundReportDialog
          report={foundSelected}
          isOpen={foundShowDialog}
          meIsReporter={foundSelected?.ownerId === userId}
          onClose={() => {
            setFoundShowDialog(false)
            setFoundSelected(null)
          }}
          onMarkResolved={markFoundResolved}
        />

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

        {showCard && selectedReport && !isMobile && (
          <PetReportCard
            report={selectedReport}
            screenXY={projectToPct(
              selectedReport.longitude,
              selectedReport.latitude
            )}
            onViewDetails={() => {
              setShowDialog(true)
              setShowCard(false)
            }}
            onMarkFound={markMissingResolved}
            meIsReporter={selectedReport.reporter_id === userId}
            onReportSighting={openFoundModal}
            onClose={() => {
              setShowCard(false)
              setSelectedReport(null)
            }}
          />
        )}

        <PetReportDialog
          report={selectedReport}
          isOpen={showDialog}
          onClose={() => {
            setShowDialog(false)
            setSelectedReport(null)
          }}
          onMarkFound={markMissingResolved}
          meIsReporter={selectedReport?.reporter_id === userId}
          onReportSighting={openFoundModal}
        />

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

      {!mapLoaded && (
        <LoadingScreen title="Cargando reportes" subtext="Por favor, espera mientras cargamos los reportes de mascotas desaparecidas." icon={Search} accentIcon={Search} />
      )}
    </div>
  );
}

import React from "react";
import { MissingReport } from "@/types/find";
import { Marker } from "react-map-gl/mapbox";
import { Dog } from "lucide-react";

interface MapMarkersProps {
  reports: MissingReport[];
  onSelect: (report: MissingReport) => void;
}

export default function MapMarkers({ reports, onSelect }: MapMarkersProps) {
  return (
    <>
      {reports.map((r) => (
        <Marker
          key={r.id}
          latitude={r.latitude}
          longitude={r.longitude}
          anchor="bottom"
          onClick={() => onSelect(r)}
        >
          {r.pet.photo_url ? (
            <img
              src={r.pet.photo_url}
              alt={r.pet.name}
              className="w-14 h-14 rounded-full border-2 border-white shadow-lg cursor-pointer"
            />
          ) : (
            <Dog size={28} className="text-yellow-900 cursor-pointer" />
          )}
        </Marker>
      ))}
    </>
  );
}

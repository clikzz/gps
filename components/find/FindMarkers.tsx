import React from "react";
import { Marker } from "react-map-gl/mapbox";
import { Dog } from "lucide-react";

export interface ReportItem {
  id: string;
  latitude: number;
  longitude: number;
  pet: { name: string; photo_url?: string };
}

interface MarkersProps<T extends ReportItem> {
  reports: T[];
  onSelect: (report: T) => void;
  variant?: "missing" | "found";
}

export function Markers<T extends ReportItem>({
  reports,
  onSelect,
  variant = "missing",
}: MarkersProps<T>) {
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
          <div className="relative flex items-center justify-center">
            {variant === "found" && (
              <span className="absolute inline-flex h-14 w-14 rounded-full bg-yellow-500 opacity-40 animate-ping" />
            )}
            {r.pet.photo_url ? (
              <img
                src={r.pet.photo_url}
                alt={r.pet.name}
                className={`w-12 h-12 rounded-full border-2 border-white shadow-lg cursor-pointer ${
                  variant === "found" ? "relative" : ""
                }`}
              />
            ) : (
              <Dog
                size={28}
                className={`cursor-pointer ${
                  variant === "found" ? "relative text-yellow-900" : "text-yellow-900"
                }`}
              />
            )}
          </div>
        </Marker>
      ))}
    </>
  );
}
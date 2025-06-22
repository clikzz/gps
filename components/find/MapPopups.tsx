"use client";

import React, { useEffect } from "react";
import { Popup } from "react-map-gl/mapbox";
import { MissingReport } from "@/types/find";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ReportPopupProps {
  selected: MissingReport | null;
  userId: string;
  photoIndex: number;
  setPhotoIndex: (i: number) => void;
  onClose: () => void;
  onFound: ()  => void;
}

export default function ReportPopup({ selected, userId, photoIndex, setPhotoIndex, onClose, onFound }: ReportPopupProps) {
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    setPhotoIndex(0);
  }, [selected]);

  if (!selected) return null;

  const isMyReport = selected.reporter_id === userId;

  const handleMarkFound = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/find?mode=found&pet=${selected.pet_id}`,
        { method: "PUT" }
      );
      if (!res.ok) throw new Error((await res.json()).error || res.statusText);
      onClose();
      onFound();
    } catch (err: any) {
      alert("Error marcando encontrada: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  console.log("userId:", userId, "selected.reporter_id:", selected?.reporter_id)

  return (
    <Popup
      latitude={selected.latitude}
      longitude={selected.longitude}
      onClose={onClose}
      closeOnClick={false}
      anchor="top"
      closeButton={false}
      maxWidth="none"
    >
      <Card className="w-60 mx-auto overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-10 text-gray-600 hover:text-gray-800"
        >
          <X size={16} />
        </button>

        <CardHeader className="flex flex-row items-center space-x-3 p-4">
          {selected.pet.photo_url ? (
            <img
              src={selected.pet.photo_url}
              alt={selected.pet.name}
              className="w-14 h-14 object-cover rounded-full flex-shrink-0"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0" />
          )}
          <div className="flex-1">
            <CardTitle className="text-base">{selected.pet.name}</CardTitle>
            <p className="text-sm text-muted-foreground">
              Reportado por: {selected.reporter.name}
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-2 p-4 pt-0">
          {selected.photo_urls && selected.photo_urls.length > 0 && (
            <div className="relative">
              <img
                src={selected.photo_urls[photoIndex]}
                alt={`respaldo ${photoIndex + 1}`}
                className="w-full h-32 object-cover rounded"
              />
              {photoIndex > 0 && (
                <button
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 p-1 rounded-full"
                  onClick={() => setPhotoIndex(photoIndex - 1)}
                >
                  <ChevronLeft className="h-4 w-4 text-white" />
                </button>
              )}
              {photoIndex < selected.photo_urls.length - 1 && (
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 p-1 rounded-full"
                  onClick={() => setPhotoIndex(photoIndex + 1)}
                >
                  <ChevronRight className="h-4 w-4 text-white" />
                </button>
              )}
            </div>
          )}

          {selected.description ? (
            <p className="text-sm text-black">{selected.description}</p>
          ) : (
            <p className="text-sm italic text-muted-foreground">
              Sin descripción
            </p>
          )}
          <p className="text-xs text-muted-foreground text-right">
            {new Date(selected.reported_at).toLocaleString()}
          </p>

          {isMyReport && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkFound}
              disabled={loading}
              className="w-full mt-2"
            >
              {loading ? "Marcando..." : "Marcar encontrada"}
            </Button>
          )}
        </CardContent>
      </Card>
    </Popup>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FoundReport } from "@/types/find";

interface FoundReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FoundReports({
  isOpen,
  onClose,
}: FoundReportsModalProps) {
  const [foundReports, setFoundReports] = useState<FoundReport[]>([]);
  const [loading, setLoading] = useState(false);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [photoIdx, setPhotoIdx] = useState(0);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    fetch("/api/find?mode=found")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: FoundReport[]) => {
        setFoundReports(data);
        setCurrentIdx(0);
        setPhotoIdx(0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [isOpen]);

  useEffect(() => {
    setPhotoIdx(0);
  }, [currentIdx]);

  if (!isOpen) return null;

  const total = foundReports.length;
  const report = foundReports[currentIdx];

  const prevReport = () =>
    setCurrentIdx((i) => (i > 0 ? i - 1 : total - 1));
  const nextReport = () =>
    setCurrentIdx((i) => (i < total - 1 ? i + 1 : 0));

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-3xl mx-4 relative">
        <CardHeader>
          <CardTitle>Avisos de Hallazgo</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {loading ? (
            <p>Cargando…</p>
          ) : total === 0 ? (
            <p>No tienes avisos de hallazgos aún.</p>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <p className="text-lg font-semibold">🐾 {report.pet.name}</p>
                <Badge variant="secondary">Aviso</Badge>
              </div>

              {report.photo_urls && report.photo_urls.length > 0 ? (
                <div className="relative w-full h-80 mb-4">
                  <img
                    src={report.photo_urls[photoIdx]}
                    alt={`evidencia ${photoIdx + 1}`}
                    className="w-full h-full object-cover rounded"
                  />
                  <button
                    className="absolute left-1 top-1/2 -translate-y-1/2 bg-black/50 p-1 rounded-full"
                    onClick={() =>
                      setPhotoIdx((i) =>
                        i > 0 ? i - 1 : report.photo_urls!.length - 1
                      )
                    }
                  >
                    ‹
                  </button>
                  <button
                    className="absolute right-1 top-1/2 -translate-y-1/2 bg-black/50 p-1 rounded-full"
                    onClick={() =>
                      setPhotoIdx((i) =>
                        i < report.photo_urls!.length - 1 ? i + 1 : 0
                      )
                    }
                  >
                    ›
                  </button>
                </div>
              ) : (
                report.pet.photo_url && (
                  <img
                    src={report.pet.photo_url}
                    alt={report.pet.name}
                    className="w-full h-48 object-cover rounded mb-4"
                  />
                )
              )}
              <p className="text-xs text-muted-foreground">
                Por: {report.helper.name} •{" "}
                {new Date(report.reported_at).toLocaleString()}
              </p>
              {report.description && (
                <p className="text-sm mt-1">{report.description}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                📍 {`${report.address || report.street}, ${report.city}, ${report.region}` || "Ubicación no registrada"}
              </p>
            </>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={prevReport}
              disabled={total <= 1}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={nextReport}
              disabled={total <= 1}
            >
              Siguiente
            </Button>
          </div>
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
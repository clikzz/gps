"use client";

import React, { useEffect, useState } from "react";
import { MissingReport } from "@/types/find";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

interface OthersReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoTo: (report: MissingReport) => void;
}

export default function OthersReportsModal({
  isOpen,
  onClose,
  onGoTo,
}: OthersReportsModalProps) {
  const [othersReports, setOthersReports] = useState<MissingReport[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    fetch("/api/find?mode=others")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: MissingReport[]) => setOthersReports(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-3xl mx-4">
        <CardHeader>
          <CardTitle>Reportes de Otros Usuarios</CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <p>Cargando…</p>
          ) : othersReports.length === 0 ? (
            <p>No hay reportes de otros usuarios.</p>
          ) : (
            <ul className="space-y-4">
              {othersReports.map((r) => (
                <Card
                  key={r.id}
                  className="border flex flex-row items-center space-x-3 p-4"
                >
                  {/* Imagen */}
                  <div className="flex-shrink-0">
                    {r.pet.photo_url ? (
                      <img
                        src={r.pet.photo_url}
                        alt={r.pet.name}
                        className="w-28 h-28 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-28 h-28 bg-gray-200 rounded-full" />
                    )}
                  </div>

                  {/* Contenido */}
                  <CardContent className="flex-1 p-4 pt-0">
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-semibold">🐾 {r.pet.name}</p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onGoTo(r)}
                      >
                        Ver en mapa
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Reportado por: {r.reporter.name} •{" "}
                      {new Date(r.reported_at).toLocaleString()}
                    </p>
                    {r.description ? (
                      <p className="text-sm mt-1">{r.description}</p>
                    ) : (
                      <p className="text-sm italic text-muted-foreground mt-1">
                        Sin descripción
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      📍 {`${r.address || r.street}, ${r.city}, ${r.region}` || "Ubicación no registrada"}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </ul>
          )}
        </CardContent>

        <CardFooter className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface FoundReport {
  id: string;
  missingPetId: string;
  helper: { id: string; name: string };
  pet: { id: string; name: string; photo_url?: string };
  description?: string;
  latitude: number;
  longitude: number;
  reported_at: string;
}

interface FoundReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FoundReportsModal({
  isOpen, onClose
}: FoundReportsModalProps) {
  const [foundReports, setFoundReports] = useState<FoundReport[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    fetch('/api/find?mode=found')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: FoundReport[]) => setFoundReports(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-3xl mx-4">
        <CardHeader>
          <CardTitle>Avisos de Hallazgo</CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <p>Cargando…</p>
          ) : foundReports.length === 0 ? (
            <p>No tienes avisos de hallazgos aún.</p>
          ) : (
            <ul className="space-y-4">
              {foundReports.map((r) => (
                <Card key={r.id} className="border flex space-x-4 p-4">
                  <img
                    src={r.pet.photo_url}
                    alt={r.pet.name}
                    className="w-16 h-16 rounded-full object-cover border"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold">🐾 {r.pet.name}</p>
                      <Badge variant="secondary">Aviso</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Por: {r.helper.name || "Desconocido"} • {new Date(r.reported_at).toLocaleString()}
                    </p>
                    {r.description && (
                      <p className="text-sm mt-1">{r.description}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Ubicación: ({r.latitude.toFixed(5)}, {r.longitude.toFixed(5)})
                    </p>
                  </div>
                </Card>
              ))}
            </ul>
          )}
        </CardContent>

        <CardFooter className="flex justify-end">
          <Button variant="outline" onClick={onClose}>Cerrar</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface MissingReport {
  id: string;
  pet_id: string;
  reporter_id: string;
  latitude: number;
  longitude: number;
  photo_url: string | null;
  description?: string;
  reported_at: string;
  pet: { id: string; name: string };
  reporter: { id: string; name: string };
}

interface MyReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MyReportsModal({ isOpen, onClose }: MyReportsModalProps) {
  const [myReports, setMyReports] = useState<MissingReport[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);

    fetch('/api/find?mode=all')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: MissingReport[]) => {
        setMyReports(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-3xl mx-4">
        <CardHeader>
          <CardTitle>Mis Reportes</CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <p>Cargando…</p>
          ) : myReports.length === 0 ? (
            <p>No tienes reportes aún.</p>
          ) : (
            <ul className="space-y-4">
              {myReports.map((r) => (
                <Card key={r.id} className="border">
                  <CardHeader className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-semibold">🐾 {r.pet.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(r.reported_at).toLocaleString()}
                      </p>
                    </div>
                    <Badge variant="secondary">Activo</Badge>
                  </CardHeader>

                  <CardContent>
                    {r.description ? (
                      <p className="text-sm">{r.description}</p>
                    ) : (
                      <p className="text-sm italic text-muted-foreground">
                        Sin descripción
                      </p>
                    )}
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
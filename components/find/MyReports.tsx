'use client';

import React, { useEffect, useState } from 'react';
import { MissingReport } from '@/app/types/find';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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

    fetch('/api/find?mode=my')
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
                <Card key={r.id} className="border flex flex-row items-center space-x-3 p-4">
                  <CardHeader className="flex items-center p-4 space-x-4">
                    {r.pet.photo_url ? (
                      <img
                        src={r.pet.photo_url}
                        alt={r.pet.name}
                        className="w-28 h-28 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0" />
                    )}
                  </CardHeader>

                  <CardContent className="p-4 pt-0">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between space-x-4">
                        <p className="text-lg font-semibold">🐾 {r.pet.name}</p>
                        <Badge variant="secondary">Activo</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(r.reported_at).toLocaleString()}
                      </p>
                    </div>
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
'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

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

interface OthersReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OthersReportsModal({ isOpen, onClose }: OthersReportsModalProps) {
  const [othersReports, setOthersReports] = useState<MissingReport[]>([]);
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
        setOthersReports(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4">Reportes de Otros Usuarios</h2>
        {loading ? (
          <p>Cargando…</p>
        ) : othersReports.length === 0 ? (
          <p>No hay reportes de otros usuarios.</p>
        ) : (
          <ul className="space-y-2 max-h-80 overflow-y-auto">
            {othersReports.map((r) => (
              <li key={r.id} className="border-b pb-2">
                <p className="font-semibold">🐾 {r.pet.name}</p>
                <p className="text-xs text-gray-600">
                  Reportado por: {r.reporter.name} •{' '}
                  {new Date(r.reported_at).toLocaleString()}
                </p>
                {r.description && (
                  <p className="text-sm mt-1">{r.description}</p>
                )}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 text-right">
          <Button onClick={onClose} variant="outline">
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
}
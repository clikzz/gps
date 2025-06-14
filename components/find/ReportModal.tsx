'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';

interface Pet {
  id: string;
  name: string;
}

export interface LatLng {
  lat: number;
  lng: number;
}

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    pet_id: string;
    description?: string;
    photo_urls?: string[];
    location?: LatLng;
  }) => void;
  onPickLocation: () => void;
  pickedLocation: LatLng | null;
}

export default function ReportModal({
  isOpen,
  onClose,
  onSubmit,
  onPickLocation,
  pickedLocation,
}: ReportModalProps) {
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<string>('');
  const [files, setFiles] = useState<File[]>([]);
  const [description, setDescription] = useState<string>('');
  const [loadingPets, setLoadingPets] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setLoadingPets(true);
    fetch('/api/find?mode=pets')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: Pet[]) => setPets(data))
      .catch((err) => {
        console.error('Error al traer pets:', err);
        setPets([]);
      })
      .finally(() => setLoadingPets(false));
  }, [isOpen]);

  if (!isOpen) return null;

  const uploadAll = async (): Promise<string[]> => {
    const urls: string[] = [];
    for (const file of files) {
      const form = new FormData();
      form.append("file", file);
      form.append("type", "find");
      const res = await fetch("/api/upload", { method: "POST", body: form });
      if (!res.ok) throw new Error("Error al subir foto de referencia");
      const { url } = await res.json();
      urls.push(url);
    }
    return urls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPetId) {
      alert('Debes seleccionar una mascota.');
      return;
    }

    let photo_urls: string[] = [];
    if (files.length) {
      try {
        photo_urls = await uploadAll();
      } catch (err) {
        console.error(err);
        alert("Error subiendo fotos de referencia");
        return;
      }
    }

    onSubmit({
      pet_id: selectedPetId,
      description: description || undefined,
      photo_urls: photo_urls.length ? photo_urls : undefined,
      location: pickedLocation || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle>Reportar Mascota Perdida</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* Dropdown de mascotas */}
            <div>
              <Label htmlFor="pet-select">Selecciona tu mascota</Label>
              {loadingPets ? (
                <p className="text-sm text-muted-foreground">Cargando mascotas…</p>
              ) : (
                <select
                  id="pet-select"
                  value={selectedPetId}
                  onChange={(e) => setSelectedPetId(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="">Tus mascotas</option>
                  {pets.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Input de foto */}
            <div>
              <Label htmlFor="photo-input">Foto de respaldo</Label>
              <Input
                id="photo-input"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const chosen = Array.from(e.target.files || []);
                  setFiles(chosen.slice(0, 3)); // límite 3
                }}
                className="mt-1"
              />
            </div>

            {/* Descripción opcional */}
            <div>
              <Label htmlFor="description">Descripción</Label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                placeholder="Agregar detalles que ayuden a encontrarla"
              />
            </div>

            {/* Botón para marcar ubicación en mapa */}
            <div>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={onPickLocation}
              >
                {pickedLocation
                  ? `Ubicación seleccionada: (${pickedLocation.lat.toFixed(5)}, ${pickedLocation.lng.toFixed(5)})`
                  : 'Marcar ubicación en el mapa'}
              </Button>
            </div>

            {/* Nota sobre ubicación */}
            <p className="text-sm text-muted-foreground">
              {pickedLocation
                ? 'Si estás satisfecho con la ubicación marcada, continúa con el envío.'
                : 'Si no marcas ubicación, se tomará el centro actual del mapa al enviar.'}
            </p>
          </CardContent>

          <CardFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Enviar Reporte</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
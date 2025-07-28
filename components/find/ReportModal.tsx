'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { Minimap } from "@/components/Minimap";
import PhotoThumb from '@/components/PhotoThumb';
import { toast } from 'sonner';
import type { ReportDraft } from '@/types/find';

interface Pet {
  id: string;
  name: string;
}

export interface LatLng {
  lat: number;
  lng: number;
}

interface Props {
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
  draft: ReportDraft;
  onDraftChange: (d: ReportDraft) => void;
}

export default function ReportModal({
  isOpen,
  draft,
  onDraftChange,
  pickedLocation,
  onPickLocation,
  onClose,
  onSubmit,
}: Props) {
  const [pets, setPets] = useState<Pet[]>([])
  const [loadingPets, setLoadingPets] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    setLoadingPets(true)
    fetch('/api/find?mode=pets')
      .then(res => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data: Pet[]) => setPets(data))
      .catch(() => {
        toast.error('No se pudieron cargar tus mascotas.')
        setPets([])
      })
      .finally(() => setLoadingPets(false))
  }, [isOpen])

  if (!isOpen) return null

  const totalFotos = draft.photos.length

  const uploadAll = async () => {
    const urls: string[] = []
    for (const { file } of draft.photos) {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('type', 'find')
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      if (!res.ok) throw new Error('Error subiendo foto.')
      urls.push((await res.json()).url)
    }
    return urls
  }

  const handleRemovePhoto = (url: string) => {
    onDraftChange({
      ...draft,
      photos: draft.photos.filter(p => {
        if (p.preview === url) URL.revokeObjectURL(p.preview)
        return p.preview !== url
      }),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!draft.petId) {
      toast.info('Debes seleccionar una mascota.')
      return
    }

    let photo_urls: string[] | undefined
    if (draft.photos.length) {
      try {
        photo_urls = await uploadAll()
      } catch (err) {
        toast.error('Error subiendo fotos.')
        return
      }
    }

    onSubmit({
      pet_id: draft.petId,
      description: draft.description || undefined,
      photo_urls,
      location: pickedLocation || undefined,
    })
  }

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-md max-h-full overflow-y-auto">
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
                  value={draft.petId}
                  onChange={(e) => onDraftChange({ ...draft, petId: e.target.value })}
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
              {totalFotos > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {draft.photos.map(p => (
                    <PhotoThumb
                      key={p.preview}
                      url={p.preview}
                      onRemove={handleRemovePhoto}
                    />
                  ))}
                </div>
              )}
              <Input
                id="photo-input"
                type="file"
                accept="image/*"
                multiple
                onChange={e => {
                  const chosen = Array.from(e.target.files || [])
                  if (chosen.length === 0) return
                  if (chosen.length + totalFotos > 3) {
                    toast.error('Máx. 3 fotos')
                    return
                  }
                  const added = chosen.map(f => ({
                    file: f,
                    preview: URL.createObjectURL(f),
                  }))
                  onDraftChange({ ...draft, photos: [...draft.photos, ...added] })
                }}
                className="mt-1"
              />
            </div>

            {/* Descripción opcional */}
            <div>
              <Label htmlFor="description">Descripción</Label>
              <textarea
                id="description"
                value={draft.description}
                onChange={(e) => onDraftChange({ ...draft, description: e.target.value })}
                rows={3}
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                placeholder="Agregar detalles que ayuden a encontrarla"
              />
            </div>

            {/* Botón para marcar ubicación en mapa */}
            <div>
              <Label>Ubicación de desaparición</Label>
              {pickedLocation && (
                <div className="mt-3">
                  <Minimap
                    location={{
                      lat: pickedLocation.lat,
                      lng: pickedLocation.lng,
                    }}
                    height="100px"
                  />
                </div>
              )}
              <Button
                type="button"
                variant="outline"
                className="w-full mt-2"
                onClick={onPickLocation}
              >
                <MapPin className="w-4 h-4" />
                {pickedLocation
                  ? 'Cambiar ubicación'
                  : 'Marcar ubicación en el mapa'}
              </Button>
            </div>

            {/* Nota sobre ubicación */}
            <p className="text-sm text-muted-foreground">
              {pickedLocation
                ? 'Si estás conforme con la ubicación, continúa.'
                : 'Debes marcar la última ubicación donde viste a tu mascota.'}
            </p>
          </CardContent>

          <CardFooter className="flex justify-center space-x-2">
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
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { MissingReport, FoundDraft } from '@/types/find';
import PhotoThumb from "@/components/PhotoThumb";
import { Minimap } from "@/components/Minimap";
import { MapPin } from 'lucide-react';
import { LatLng } from '@/components/find/ReportModal';
import { Added } from '@/types/find';

interface Props {
  isOpen: boolean;
  report: MissingReport;
  pickedLocation?: LatLng | null;
  onPickLocation?: () => void;
  onClose: () => void;
  onSubmitted: () => void;
  draft: FoundDraft
  onDraftChange: (d: FoundDraft) => void
}

export default function FoundReportModal({
  isOpen,
  onClose,
  report,
  onSubmitted,
  pickedLocation,
  onPickLocation,
  draft,
  onDraftChange
}: Props) {

  const uploadAll = async (): Promise<string[]> => {
    const urls: string[] = []
    for (const { file } of draft.photos) {
      const fd = new FormData()
      fd.append("file", file)
      fd.append("type", "find")
      const res = await fetch("/api/upload", { method: "POST", body: fd })
      if (!res.ok) throw new Error("Error al subir foto de hallazgo.")
      urls.push((await res.json()).url)
    }
    return urls
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let photo_urls: string[] = [];
    if (draft.photos.length) {
      try {
        photo_urls = await uploadAll();
      } catch {
        toast.error("Error subiendo fotos de hallazgo.")
        return
      }
    }

    try {
      const res = await fetch('/api/find?mode=found', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          missingPetId: Number(report.id),
          description: draft.description || undefined,
          photo_urls,
          latitude: pickedLocation?.lat || report.latitude,
          longitude: pickedLocation?.lng || report.longitude,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        const msg = typeof err.error === 'string' ? err.error : JSON.stringify(err);
        throw new Error(msg);
      }
      onSubmitted();
    } catch (err: any) {
      toast.error(err.message)
    }
  };

  const total = draft.photos.length

  const remove = (url:string) =>
    onDraftChange({
      ...draft,
      photos: draft.photos.filter(p => (p.preview===url ? (URL.revokeObjectURL(url),false):true))
    })

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle>Reportar hallazgo de {report.pet.name}</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="found-photo-input">Fotos de hallazgo</Label>
              {total > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {draft.photos.map(p=>(
                    <PhotoThumb key={p.preview} url={p.preview} onRemove={remove} />
                  ))}
                </div>
              )}
              <Input
                id="found-photo-input"
                type="file"
                accept="image/*"
                multiple
                onChange={e=>{
                  const files = Array.from(e.target.files||[])
                  if (!files.length) return
                  if (files.length+total>3) return toast.error("Máx. 3 fotos")
                  const extra:Added[] = files.map(f=>({file:f,preview:URL.createObjectURL(f)}))
                  onDraftChange({...draft, photos:[...draft.photos, ...extra]})
                }}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="found-description">Descripción</Label>
              <textarea
                id="found-description"
                value={draft.description}
                onChange={e => onDraftChange({...draft, description:e.target.value})}
                rows={2}
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                placeholder="Detalles del hallazgo"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Ubicación del hallazgo</Label>
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
                className="w-full"
                onClick={onPickLocation}
              >
                <MapPin className="w-4 h-4" />
                {pickedLocation
                  ? 'Cambiar ubicación'
                  : 'Marcar ubicación en el mapa'}
              </Button>
            </div>
            <div className="flex items-center text-sm text-muted-foreground justify-center">
              {pickedLocation
                ? 'Si estás conforme con la ubicación, continúa.'
                : 'Debes marcar la ubicación donde encontraste a la mascota.'}
            </div>
          </CardContent>

          <CardFooter className="flex justify-center space-x-2">
            <Button variant="outline" onClick={onClose} type="button">
              Cancelar
            </Button>
            <Button type="submit">Enviar hallazgo</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
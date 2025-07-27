import React, { useState } from 'react';
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
import { MissingReport } from '@/types/find';
import { MapPin } from 'lucide-react';
import { LatLng } from '@/components/find/ReportModal';

interface FoundReportModalProps {
  isOpen: boolean;
  report: MissingReport;
  pickedLocation?: LatLng | null;
  onPickLocation?: () => void;
  onClose: () => void;
  onSubmitted: () => void;
}

export default function FoundReportModal({
  isOpen,
  onClose,
  report,
  onSubmitted,
  pickedLocation,
  onPickLocation,
}: FoundReportModalProps) {
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<File[]>([]);

  const uploadAll = async (): Promise<string[]> => {
    const urls: string[] = [];
    for (const file of files) {
      const form = new FormData();
      form.append('file', file);
      form.append('type', 'find');
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      if (!res.ok) throw new Error('Error al subir foto de hallazgo');
      const { url } = await res.json();
      urls.push(url);
    }
    return urls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let photo_urls: string[] = [];
    if (files.length) {
      try {
        photo_urls = await uploadAll();
      } catch (err) {
        console.error(err);
        alert('Error subiendo fotos de hallazgo');
        return;
      }
    }

    try {
      const res = await fetch('/api/find?mode=found', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          missingPetId: Number(report.id),
          description: description || undefined,
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
              <Input
                id="found-photo-input"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const chosen = Array.from(e.target.files || []);
                  if (chosen.length > 3) {
                    toast.error('Solo puedes subir hasta 3 fotos.');
                    return;
                  } else if (chosen.length === 0) {
                    toast.info('Debes seleccionar al menos una foto.');
                    return;
                  }
                  setFiles(chosen);
                }}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="found-description">Descripción</Label>
              <textarea
                id="found-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                placeholder="Detalles del hallazgo"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Ubicación del hallazgo</Label>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={onPickLocation}
              >
                <MapPin className="w-4 h-4" />
                {pickedLocation
                  ? `Ubicación hallazgo: (${pickedLocation.lat.toFixed(5)}, ${pickedLocation.lng.toFixed(5)})`
                  : 'Marcar ubicación en el mapa'}
              </Button>
            </div>
            <div className="flex items-center text-sm text-muted-foreground justify-center">
              {pickedLocation
                ? 'Si te gusta esa ubicación, continúa.'
                : 'Si no marcas ubicación, se toma la original.'}
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
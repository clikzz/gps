"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { MapPin, Trash } from "lucide-react"
import { LatLng } from "@/components/find/ReportModal"
import { MissingReport } from "@/types/find"
import { Minimap } from "@/components/Minimap"
import PhotoThumb from "@/components/PhotoThumb"
import { toast } from "sonner"

type Added = { file: File; preview: string }

interface Props {
  report: MissingReport | null
  isOpen: boolean
  onClose: () => void
  onSave: (changes: Partial<{
    description: string
    photo_urls: string[]
    latitude: number
    longitude: number
  }>) => void
  onPickLocation: () => void
  pickedLocation: LatLng | null
}

export default function EditReportModal({
  report,
  isOpen,
  onClose,
  onSave,
  onPickLocation,
  pickedLocation,
}: Props) {
  const [description, setDescription] = useState("")
  const [existingPhotos, setExistingPhotos] = useState<string[]>([])
  const [added, setAdded] = useState<Added[]>([])

  useEffect(() => {
    if (!isOpen || !report) return
    setDescription(report.description || "")
    setExistingPhotos(report.photo_urls ?? [])
    setAdded([])
  }, [isOpen, report])

  if (!isOpen || !report) return null

  const uploadAdded = async (): Promise<string[]> => {
    const urls: string[] = []
    for (const { file } of added) {
      const fd = new FormData()
      fd.append("file", file)
      fd.append("type", "find")
      const res = await fetch("/api/upload", { method: "POST", body: fd })
      if (!res.ok) throw new Error("Error al subir foto")
      const { url } = await res.json()
      urls.push(url)
    }
    return urls
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    let photo_urls = [...existingPhotos]
    if (added.length) {
      try {
        const uploaded = await uploadAdded()
        photo_urls = [...photo_urls, ...uploaded]
      } catch (err) {
        console.error(err)
        return toast.error("No se pudieron subir las fotos.")
      }
    }

    const changes: any = {}
    if (photo_urls.join("") !== (report.photo_urls ?? []).join(""))
      changes.photo_urls = photo_urls
    if (description.trim() !== (report.description || ""))
      changes.description = description.trim()
    if (pickedLocation &&
        (pickedLocation.lat !== report.latitude ||
        pickedLocation.lng !== report.longitude)) {
      changes.latitude  = pickedLocation.lat
      changes.longitude = pickedLocation.lng
    }

    if (Object.keys(changes).length === 0)
      return toast.info("No hiciste cambios.");

    onSave(changes)
  }

  const removePhoto = (url: string) => {
    if (existingPhotos.includes(url)) {
      setExistingPhotos(prev => prev.filter(u => u !== url))
    } else {
      setAdded(prev => {
        const item = prev.find(a => a.preview === url)
        if (item) URL.revokeObjectURL(item.preview)
        return prev.filter(a => a.preview !== url)
      })
    }
  }

  const totalFotos = existingPhotos.length + added.length

  console.log("Existing photos:", existingPhotos);

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center p-4 bg-black/50">
      <Card className="w-full max-w-md max-h-full overflow-y-auto">
        <CardHeader>
          <CardTitle>Editar reporte de {report.pet.name}</CardTitle>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* Fotos */}
            <div className="space-y-2">
              <Label>Fotos actuales</Label>

              {(totalFotos === 0) ? (
                <p className="text-sm text-muted-foreground">Sin fotos.</p>
              ) : (
                <div className="flex gap-2 flex-wrap">
                  {existingPhotos.map(u => (
                    <PhotoThumb key={u} url={u} onRemove={removePhoto} />
                  ))}
                  {added.map(a => (
                    <PhotoThumb key={a.preview} url={a.preview} onRemove={removePhoto} />
                  ))}
                </div>
              )}

              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={e => {
                  const files = Array.from(e.target.files || [])
                  if (files.length === 0) return

                  if (files.length + totalFotos > 3)
                    return toast.error("Solo puedes subir 3 fotos.")

                  const toAdd: Added[] = files.map(f => ({
                    file: f,
                    preview: URL.createObjectURL(f),
                  }))
                  setAdded(prev => [...prev, ...toAdd])
                }}
              />
            </div>

            {/* Descripción */}
            <div>
              <Label htmlFor="desc">Descripción</Label>
              <textarea
                id="desc"
                rows={3}
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* ubicación */}
            <div className="space-y-1">
              <Label>Ubicación</Label>
              {(pickedLocation || (report.latitude && report.longitude)) && (
                <div className="mt-3">
                  <Minimap
                    location={{
                      lat: pickedLocation?.lat || report.latitude,
                      lng: pickedLocation?.lng || report.longitude,
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
                <MapPin className="w-4 h-4 mr-2" />
                {pickedLocation
                  ? `(${pickedLocation.lat.toFixed(5)}, ${pickedLocation.lng.toFixed(
                      5
                    )})`
                  : "Cambiar ubicación"}
              </Button>
            </div>
            </CardContent>

          <CardFooter className="flex justify-center space-x-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Guardar cambios</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
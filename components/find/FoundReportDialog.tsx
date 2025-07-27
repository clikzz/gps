"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Calendar, Camera, MapPin, CheckCircle, X, Phone, Mail, Instagram, Ban } from "lucide-react"
import { Label } from "@/components/ui/label"
import type { FoundReport } from "@/types/find"
import { translateSpecies } from "@/utils/translateSpecies"

interface Props {
  report: FoundReport | null
  isOpen: boolean
  onClose: () => void
  onMarkResolved: (r: FoundReport) => void
  onReject: (r: FoundReport) => void
  meIsReporter: boolean
}

export default function FoundReportDialog({
  report,
  isOpen,
  onClose,
  onMarkResolved,
  onReject,
  meIsReporter,
}: Props) {
  if (!isOpen || !report) return null

  const petCategory = translateSpecies(report.pet.species)

  return (
    <div className="absolute inset-0 z-50 flex justify-center items-center p-4 bg-black/50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardContent className="p-0">
          {/* Header */}
          <div className="relative p-6 pb-4">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>

            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-secondary/50">
                <img
                  src={report.pet.photo_url || "/placeholder.svg"}
                  alt={report.pet.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold">
                  {report.pet.name}
                </h2>
                <p className="font-medium text-sm">
                  Avistado por <span className="font-semibold">{report.helper.name}</span>
                </p>
                <Badge variant="outline" className="mt-2">
                  {petCategory ?? "Sin categoría"}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Descripción */}
          <div className="p-6 space-y-4">
            <div>
              <p className="font-semibold text-base mb-2">
                Descripción
              </p>
              <p className="text-sm leading-relaxed">
                {report.description || "Sin descripción"}
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="font-medium">Visto en:</span>
              <span className="line-clamp-2">
                {report.address ? `${report.address}, ${report.city}` : `${report.street}, ${report.city}` || "Ubicación no especificada"}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-secondary" />
              <span className="font-medium">Fecha:</span>
              <span>
                {new Date(report.reported_at).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          <Separator />

          {/* Fotos */}
          {report.photo_urls?.length ? (
            <>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Camera className="w-4 h-4 text-foreground" />
                  <Label className="font-semibold text-base">Fotos del hallazgo</Label>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {report.photo_urls.map((u, i) => (
                    <div key={i} className="aspect-square overflow-hidden rounded-lg">
                      <img
                        src={u}
                        alt={`foto ${i + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
            </>
          ) : null}


          <Separator />

          {/* Contacto */}
          <div className="pt-4 space-y-4">
            <div className="flex flex-col justify-center items-center text-sm">
              <Label className="font-semibold mb-3 text-base">Datos de contacto</Label>

              <div className="flex items-center gap-4 text-sm">
                {report.helper.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-foreground" />
                    <span>
                      {report.helper.phone || "No disponible"}
                  </span>
                </div>
                )}
                {report.helper.instagram && (
                  <div className="flex items-center gap-2">
                    <Instagram className="w-4 h-4 text-foreground" />
                    <a href={`https://instagram.com/${report.helper.instagram.replace(/^@/, "")}`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium">
                      {report.helper.instagram.replace(/^@/, "")}
                    </a>
                  </div>
                )}
                {report.helper.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-foreground" />
                    <span>{report.helper.email}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Acción */}
          {meIsReporter && (
            <div className="flex justify-center items-center p-4 gap-2">
              <Button
              className="flex-1"
                onClick={() => onMarkResolved(report)}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Marcar resuelto
              </Button>

              <Button
                className="flex-1"
                variant="destructive"
                onClick={() => onReject(report)}
              >
                <Ban className="w-4 h-4 mr-2" />
                Rechazar hallazgo
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

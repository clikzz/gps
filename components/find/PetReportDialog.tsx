"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import ConfirmationButton from "@/components/ConfirmationButton"
import { Calendar, Camera, MapPin, Phone, X, Instagram, Mail, Search } from "lucide-react"
import type { MissingReport } from "@/types/find"
import { translateSpecies } from "@/utils/translateSpecies"

interface Props {
  report: MissingReport | null
  isOpen: boolean
  onClose: () => void
  onReportSighting: (r: MissingReport) => void
  onMarkFound: (r: MissingReport) => Promise<void>
  meIsReporter: boolean
}

export default function PetReportDialog({
  report,
  isOpen,
  onClose,
  onReportSighting,
  onMarkFound,
  meIsReporter,
}: Props) {
  if (!isOpen || !report) return null

  const petCategory = translateSpecies(report.pet.species)

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
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
                <h2 className="text-2xl font-bold text-gray-900">
                  {report.pet.name}
                </h2>
                <p className="font-medium text-sm">Reportado por <span className="font-semibold">{report.reporter.name}</span></p>

                <div className="flex gap-2 mt-2">
                  <Badge variant="outline">{petCategory ?? "Sin categoría"}</Badge>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Info */}
          <div className="p-6 space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Descripción
              </p>
              <p className="text-sm leading-relaxed">
                {report.description || "Sin descripción"}
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="font-medium">Última vez visto:</span>
              <span className="line-clamp-2">
                {report.address ? `${report.address}, ${report.city}` : `${report.street}, ${report.city}` || "Ubicación no registrada"}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-secondary" />
              <span className="font-medium">Fecha:</span>
              <span className="line-clamp-2">
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
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Camera className="w-4 h-4 text-foreground" />
              <h3 className="text-medium">
                Fotos de referencia
              </h3>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {report.photo_urls?.map((url, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-lg overflow-hidden bg-gray-100"
                >
                  <img
                    src={url}
                    alt={`foto ${i + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Contacto */}
          <div className="p-6 space-y-4">
            <div className="flex flex-col justify-center items-center text-sm">
              <h3 className="font-medium mb-3">
                Información de contacto
              </h3>

              <div className="flex items-center gap-4 text-sm">
                {report.reporter.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-foreground" />
                    <span>
                      {report.reporter.phone || "No disponible"}
                  </span>
                </div>
                )}
                {report.reporter.instagram && (
                  <div className="flex items-center gap-2">
                    <Instagram className="w-4 h-4 text-foreground" />
                    <a href={`https://instagram.com/${report.reporter.instagram.replace(/^@/, "")}`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium">
                      {report.reporter.instagram.replace(/^@/, "")}
                    </a>
                  </div>
                )}
                {report.reporter.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-foreground" />
                    <span>{report.reporter.email}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex">
              {meIsReporter ? (
                <ConfirmationButton
                  onConfirm={async () => await onMarkFound(report)}
                  triggerText={
                    <>
                      <Search className="w-4 h-4 mr-1" /> Marcar como encontrada
                    </>
                  }
                  dialogTitle="Confirmar mascota encontrada"
                  dialogDescription="¿Estás seguro de que tu mascota ya fue encontrada? Esta acción cerrará el reporte."
                  confirmText="Confirmar"
                  cancelText="Cancelar"
                  variant="destructive"
                  size="sm"
                />
              ) : (
                <Button
                  className="flex-1"
                  onClick={() => onReportSighting(report)}
                >
                  <MapPin className="w-4 h-4 mr-2" /> Reportar hallazgo
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

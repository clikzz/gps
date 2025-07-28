"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Eye, CheckCircle } from "lucide-react"
import type { FoundReport } from "@/types/find"
import { translateSpecies } from "@/utils/translateSpecies"

interface Props {
  report: FoundReport
  screenXY: { xPct: number; yPct: number }
  onViewDetails: (r: FoundReport) => void
  onMarkResolved: (r: FoundReport) => void
  onClose: () => void
  meIsReporter: boolean
}

export default function FoundReportCard({
  report,
  screenXY,
  onViewDetails,
  onMarkResolved,
  onClose,
  meIsReporter,
}: Props) {
  const style = {
    left: `${Math.min(screenXY.xPct, 85)}%`,
    top : `${Math.min(screenXY.yPct + 3, 75)}%`,
  }

  const petCategory = translateSpecies(report.pet.species)

  return (
    <>
      <div className="absolute inset-0 z-40" onClick={onClose} />

      <div className="absolute z-50 -translate-x-1/2" style={style}>
        <Card className="w-80 shadow-xl border-2 border-background">
          <CardContent className="p-0">
            {/* Cabecera */}
            <div className="p-4 pb-3 flex items-start gap-3">
              <div className="w-16 h-16 rounded-full overflow-hidden border-3 border-background shrink-0">
                <img
                  src={report.pet.photo_url || "/placeholder.svg"}
                  alt={report.pet.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-bold truncate">
                  {report.pet.name}
                </h3>
                <p className="text-sm truncate">
                  Avistado por {report.helper.name}
                </p>
                <Badge variant="outline" className="text-xs mt-1">
                  {petCategory || "Sin categoría"}
                </Badge>
              </div>
            </div>

            {/* Datos clave */}
            <div className="px-4 pb-3 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-secondary shrink-0" />
                <span className="text-muted-foreground">
                  {new Date(report.reported_at).toLocaleDateString("es-ES", {
                    year : "numeric",
                    month: "short",
                    day  : "numeric",
                  })}
                </span>
              </div>
              <p className="text-sm mt-1 line-clamp-2">
                {report.description || "Sin descripción"}
              </p>
            </div>

            {/* Acciones */}
            <div className="flex gap-2 items-center p-3 border-t">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 bg-transparent"
                onClick={() => onViewDetails(report)}
              >
                <Eye className="w-4 h-4 mr-1" /> Ver detalles
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Flecha */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2">
          <div className="w-4 h-4 bg-background border-l-2 border-t-2 border-background rotate-45" />
        </div>
      </div>
    </>
  )
}

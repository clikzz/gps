"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useHealth } from "@/stores/health";
import { useActivePet } from "@/stores/activePet";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  AlertTriangle,
} from "lucide-react";
import { useState, useMemo } from "react";
import React from "react";
import { format, isPast, isWithinInterval, addDays } from "date-fns";
import { es } from "date-fns/locale";
import { BellRing } from "lucide-react";
import ConfirmationButton from "@/components/ConfirmationButton";

export function NextDosesTable() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const isMobile = useMediaQuery("(max-width: 640px)");
  const activePet = useActivePet((state) => state.activePet);
  const { medications, vaccinations } = useHealth();

  interface Dose {
    id: number;
    global_id: string;
    entry_type: string;
    name: string;
    next_dose_date: Date;
    isOverdue: boolean;
    isUpcoming: boolean;
    details: string;
    send?: boolean;
  }

  const nextDoses = useMemo(() => {
    if (!activePet) return [] as Dose[];

    const doses: Dose[] = [];
    const today = new Date();

    medications
      .filter(
        (med) =>
          med.pet_id.toString() == activePet.id &&
          med.active &&
          med.next_dose_date &&
          new Date(med.next_dose_date) > today
      )
      .forEach((med) => {
        const nextDate = new Date(med.next_dose_date!);
        doses.push({
          global_id: `medication-${med.id}`,
          entry_type: "Medicamento",
          name: med.name,
          next_dose_date: nextDate,
          isOverdue: isPast(nextDate),
          isUpcoming: isWithinInterval(nextDate, {
            start: today,
            end: addDays(today, 7),
          }),
          details: `Dosis: ${med.dose}`,
          id: med.id,
          send: med.send,
        });
      });

    vaccinations
      .filter(
        (vac) =>
          vac.pet_id.toString() == activePet.id &&
          vac.active &&
          vac.next_dose_date &&
          new Date(vac.next_dose_date) > today
      )
      .forEach((vac) => {
        const nextDate = new Date(vac.next_dose_date!);
        doses.push({
          global_id: `vaccination-${vac.id}`,
          entry_type: "Vacuna",
          name: vac.name,
          next_dose_date: nextDate,
          isOverdue: isPast(nextDate),
          isUpcoming: isWithinInterval(nextDate, {
            start: today,
            end: addDays(today, 7),
          }),
          details: vac.type ? `Tipo: ${vac.type}` : "",
          id: vac.id,
          send: vac.send,
        });
      });

    return doses.sort(
      (a, b) => a.next_dose_date.getTime() - b.next_dose_date.getTime()
    );
  }, [activePet, medications, vaccinations]);

  console.log(nextDoses);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const totalPages = Math.ceil(nextDoses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDoses = nextDoses.slice(startIndex, endIndex);

  const getPageNumbers = useMemo(() => {
    const delta = isMobile ? 1 : 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  }, [currentPage, totalPages, isMobile]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleEnableNotifications = async (dose: Dose) => {
    console.log(`Habilitar notificaciones para la dosis: ${dose.name}`);
    try {
      const response = await fetch(`/api/health/alerts/${dose.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dose: dose }),
      });

      if (!response.ok) {
        throw new Error("Error al habilitar notificaciones");
      }

      alert(`Notificaciones habilitadas para ${dose.name}`);

      console.log(`Notificaciones habilitadas para ${dose.name}`);

      const updatedDoses = nextDoses.map((d) =>
        d.global_id === dose.global_id ? { ...d, send: true } : d
      );
      useHealth.setState({
        medications: medications.map((med) =>
          med.id === dose.id ? { ...med, send: true } : med
        ),
        vaccinations: vaccinations.map((vac) =>
          vac.id === dose.id ? { ...vac, send: true } : vac
        ),
      });
      console.log("Dosis actualizadas:", updatedDoses);

      console.log("Notificaciones habilitadas correctamente");
    } catch (error) {
      console.error("Error al habilitar notificaciones:", error);
      alert("No se pudo habilitar las notificaciones. Inténtalo más tarde.");
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Próxima Dosis</TableHead>
              <TableHead>Avisar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentDoses.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground"
                >
                  No hay próximas dosis programadas
                </TableCell>
              </TableRow>
            ) : (
              currentDoses.map((dose, index) => (
                <TableRow key={dose.global_id}>
                  <TableCell>
                    <Badge
                      variant={
                        dose.entry_type === "Medicamento"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {dose.entry_type}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{dose.name}</TableCell>
                  <TableCell>
                    {format(dose.next_dose_date, "PPP", { locale: es })}
                  </TableCell>
                  <TableCell>
                    <div>
                      {dose.send ? (
                        <Badge>Te avisaremos!</Badge>
                      ) : (
                        <ConfirmationButton
                          onConfirm={() => handleEnableNotifications(dose)}
                          triggerText={
                            <span className="flex items-center gap-2">
                              <BellRing className="h-2 w-2" />
                              {isMobile ? "" : "Notificar"}
                            </span>
                          }
                          dialogTitle={`Notificar sobre ${dose.name}`}
                          dialogDescription={`¿Deseas recibir un recordatorio 1 día antes en tu correo para la próxima dosis de ${dose.name}?`}
                          confirmText="Notificar"
                          cancelText="Cancelar"
                          variant="secondary"
                          size="sm"
                        />
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell
                colSpan={5}
                className={`text-right ${isMobile ? "text-sm" : ""}`}
              >
                Mostrando {startIndex + 1}-
                {Math.min(endIndex, nextDoses.length)} de {nextDoses.length}{" "}
                próximas dosis
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      {/* Controles de paginación */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
          {isMobile && (
            <div className="text-sm text-muted-foreground">
              Página {currentPage} de {totalPages}
            </div>
          )}

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size={isMobile ? "sm" : "default"}
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className={isMobile ? "px-2" : ""}
            >
              <ChevronsLeft className="h-4 w-4" />
              {!isMobile && <span className="ml-1">Primera</span>}
            </Button>

            <Button
              variant="outline"
              size={isMobile ? "sm" : "default"}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={isMobile ? "px-2" : ""}
            >
              <ChevronLeft className="h-4 w-4" />
              {!isMobile && <span className="ml-1">Anterior</span>}
            </Button>

            {!isMobile && (
              <div className="flex items-center gap-1 mx-2">
                {getPageNumbers.map((pageNum, index) => (
                  <React.Fragment key={index}>
                    {pageNum === "..." ? (
                      <span className="px-2 text-muted-foreground">...</span>
                    ) : (
                      <Button
                        variant={
                          currentPage === pageNum ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => handlePageChange(pageNum as number)}
                        className="min-w-[40px]"
                      >
                        {pageNum}
                      </Button>
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}

            <Button
              variant="outline"
              size={isMobile ? "sm" : "default"}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={isMobile ? "px-2" : ""}
            >
              {!isMobile && <span className="mr-1">Siguiente</span>}
              <ChevronRight className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size={isMobile ? "sm" : "default"}
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className={isMobile ? "px-2" : ""}
            >
              {!isMobile && <span className="mr-1">Última</span>}
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

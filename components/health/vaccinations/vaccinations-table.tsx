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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useHealth } from "@/stores/health";
import { useActivePet } from "@/stores/activePet";
import { useMediaQuery } from "@/hooks/use-media-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
  Edit,
  Trash2,
} from "lucide-react";
import { useState, useMemo } from "react";
import React from "react";
import { EditVaccinationDialog } from "./edit-vaccination-dialog";
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog";
import { Vaccination } from "@/types/vaccination";

type VaccineType =
  | "rabies"
  | "distemper"
  | "parvovirus"
  | "leptospirosis"
  | "bordetella"
  | "other";

const vaccineTypeLabels: Record<VaccineType, string> = {
  rabies: "Rabia",
  distemper: "Moquillo",
  parvovirus: "Parvovirus",
  leptospirosis: "Leptospirosis",
  bordetella: "Bordetella",
  other: "Otra",
};

export function VaccinationsTable() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const isMobile = useMediaQuery("(max-width: 640px)");
  const activePet = useActivePet((state) => state.activePet);
  const { vaccinations, deleteVaccination } = useHealth();
  const [editingVaccination, setEditingVaccination] =
    useState<Vaccination | null>(null);
  const [deletingVaccination, setDeletingVaccination] =
    useState<Vaccination | null>(null);

  const petVaccinations = vaccinations.filter(
    (vac) => vac.pet_id.toString() == activePet?.id && vac.active
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const totalPages = Math.ceil(petVaccinations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentVaccinations = petVaccinations.slice(startIndex, endIndex);

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

  const handleDelete = async (vaccination: any) => {
    try {
      await deleteVaccination(vaccination.id);
      setDeletingVaccination(null);
    } catch (error) {
      console.error("Error deleting vaccination:", error);
    }
  };

  return (
    <>
      <motion.div
        className="rounded-lg border overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Aplicación</TableHead>
                <TableHead>Próxima Dosis</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence mode="wait">
                {currentVaccinations.map((vaccination, index) => (
                  <motion.tr
                    key={`${vaccination.id}-${currentPage}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: 0.05 * index, duration: 0.3 }}
                    className="group hover:bg-muted/50 transition-colors duration-200"
                  >
                    <TableCell className="font-medium">
                      {vaccination.name}
                    </TableCell>
                    <TableCell>
                      {vaccination.type && (
                        <Badge variant="secondary">
                          {vaccineTypeLabels[vaccination.type as VaccineType] ||
                            vaccination.type}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(
                        vaccination.application_date
                      ).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {vaccination.next_dose_date
                        ? new Date(
                            vaccination.next_dose_date
                          ).toLocaleDateString()
                        : "No programada"}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              const converted = {
                                name: vaccination.name,
                                application_date: new Date(
                                  vaccination.application_date
                                ),
                                id: vaccination.id.toString(),
                                type: vaccination.type as VaccineType | null,
                                active: vaccination.active,
                                notes: vaccination.notes,
                                pet_id: vaccination.pet_id.toString(),
                                next_dose_date: vaccination.next_dose_date
                                  ? new Date(vaccination.next_dose_date)
                                  : null,
                              };
                              setEditingVaccination(converted);
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              const converted = {
                                name: vaccination.name,
                                application_date: new Date(
                                  vaccination.application_date
                                ),
                                id: vaccination.id.toString(),
                                type: vaccination.type as VaccineType | null,
                                active: vaccination.active,
                                notes: vaccination.notes,
                                pet_id: vaccination.pet_id.toString(),
                                next_dose_date: vaccination.next_dose_date
                                  ? new Date(vaccination.next_dose_date)
                                  : null,
                              };
                              setDeletingVaccination(converted);
                            }}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell
                  colSpan={5}
                  className={`text-right ${isMobile ? "text-sm" : ""}`}
                >
                  Mostrando {startIndex + 1}-
                  {Math.min(endIndex, petVaccinations.length)} de{" "}
                  {petVaccinations.length} vacunas
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>

        {/* Controles de paginación */}
        {totalPages > 1 && (
          <motion.div
            className="flex items-center justify-center gap-4 p-4 border-t bg-muted/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
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
          </motion.div>
        )}
      </motion.div>

      {/* Edit Dialog */}
      <EditVaccinationDialog
        vaccination={editingVaccination}
        open={!!editingVaccination}
        onOpenChange={(open) => !open && setEditingVaccination(null)}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={!!deletingVaccination}
        onOpenChange={(open) => !open && setDeletingVaccination(null)}
        onConfirm={() => handleDelete(deletingVaccination)}
        title="Eliminar Vacuna"
        description={`¿Estás seguro de que quieres eliminar "${deletingVaccination?.name}"? Esta acción no se puede deshacer.`}
      />
    </>
  );
}

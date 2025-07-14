"use client";

import React from "react";
import { useUserProfile } from "@/stores/userProfile";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  PawPrint,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { translateSpecies } from "@/utils/translateSpecies";
import { useState, useMemo } from "react";
import { EditPetDrawer } from "./EditPetDrawer";

function PetsTable() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const isMobile = useMediaQuery("(max-width: 640px)");
  const pets = useUserProfile((state) => state.user?.Pets || []);
  const [selectedPet, setSelectedPet] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const totalPages = Math.ceil(pets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPets = pets.slice(startIndex, endIndex);
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

  const handleRowClick = (pet: any) => {
    setSelectedPet(pet);
    setIsDrawerOpen(true);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className={`${isDesktop ? "col-span-3" : "col-span-1"}`}>
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
                <TableHead className={`${isMobile ? "w-[60px]" : "w-[80px]"}`}>
                  Foto
                </TableHead>
                <TableHead
                  className={`${isMobile ? "min-w-[100px]" : "min-w-[120px]"}`}
                >
                  Nombre
                </TableHead>
                <TableHead
                  className={`${isMobile ? "min-w-[90px]" : "min-w-[100px]"}`}
                >
                  Especie
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence mode="wait">
                {currentPets.map((pet, index) => (
                  <motion.tr
                    key={`${pet.id}-${currentPage}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: 0.05 * index, duration: 0.3 }}
                    className="group cursor-pointer hover:bg-muted/50 transition-colors duration-200"
                    onClick={() => handleRowClick(pet)}
                    whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                  >
                    <TableCell className="p-2">
                      {pet.photo_url ? (
                        <motion.img
                          src={pet.photo_url}
                          alt={pet.name}
                          className={`${isMobile ? "w-10 h-10" : "w-12 h-12"} object-cover rounded-full border-2 border-primary/20`}
                          whileHover={{ scale: 1.05 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        />
                      ) : (
                        <motion.div
                          className={`${isMobile ? "w-10 h-10" : "w-12 h-12"} bg-muted flex items-center justify-center rounded-full text-center`}
                          whileHover={{ scale: 1.05 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <PawPrint
                            className={`${isMobile ? "h-4 w-4" : "h-5 w-5"} text-muted-foreground`}
                          />
                        </motion.div>
                      )}
                    </TableCell>
                    <TableCell
                      className={`font-medium ${isMobile ? "text-sm" : ""}`}
                    >
                      <div className="flex items-center gap-2">
                        {pet.name}
                        {pet.active === false && (
                          <Badge
                            variant="secondary"
                            className={`mt-1 ${isMobile ? "text-xs px-2 py-1" : ""}`}
                          >
                            Deshabilitado
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {pet.species ? (
                        <Badge
                          variant="outline"
                          className={`whitespace-nowrap ${isMobile ? "text-xs px-2 py-1" : ""}`}
                        >
                          {translateSpecies(pet.species) || "Sin especificar"}
                        </Badge>
                      ) : (
                        <span
                          className={`text-muted-foreground ${isMobile ? "text-xs" : "text-sm"}`}
                        >
                          Sin especificar
                        </span>
                      )}
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell
                  colSpan={3}
                  className={`text-right ${isMobile ? "text-sm" : ""}`}
                >
                  Mostrando {startIndex + 1}-{Math.min(endIndex, pets.length)}{" "}
                  de {pets.length} mascotas
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
            {/* Información de página en móvil */}
            {isMobile && (
              <div className="text-sm text-muted-foreground">
                Página {currentPage} de {totalPages}
              </div>
            )}

            {/* Controles de navegación */}
            <div className="flex items-center gap-1">
              {/* Botón primera página */}
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

              {/* Botón página anterior */}
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

              {/* Números de página */}
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

              {/* Botón página siguiente */}
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

              {/* Botón última página */}
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

      <div className="mt-4 text-muted-foreground text-sm text-center">
        <p>Toca una mascota para ver o editar sus detalles.</p>
      </div>

      {selectedPet && (
        <EditPetDrawer
          pet={selectedPet}
          open={isDrawerOpen}
          onOpenChange={setIsDrawerOpen}
        />
      )}
    </div>
  );
}

export default PetsTable;

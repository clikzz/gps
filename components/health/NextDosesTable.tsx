import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useHealth } from "@/stores/health";
import { useActivePet } from "@/stores/activePet";
import { useMediaQuery } from "@/hooks/use-media-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useState, useMemo } from "react";
import React from "react";

export function NextDosesTable() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const isMobile = useMediaQuery("(max-width: 640px)");
  const activePet = useActivePet((state) => state.activePet);
  const nextDoses = useHealth((state) => state.nextDoses).filter(
    (dose) => dose.pet_id == activePet?.id
  );

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

  return (
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
              <TableHead>Tipo</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Próxima Dosis</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="wait">
              {currentDoses.map((dose, index) => (
                <motion.tr
                  key={`${dose.global_id}-${currentPage}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: 0.05 * index, duration: 0.3 }}
                  className="group hover:bg-muted/50 transition-colors duration-200"
                  whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                >
                  <TableCell>{dose.entry_type}</TableCell>
                  <TableCell>{dose.name}</TableCell>
                  <TableCell>
                    {new Date(
                      dose.next_dose_date ?? new Date()
                    ).toLocaleDateString()}
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
  );
}

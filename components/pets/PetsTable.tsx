import React from "react";
import { useUserProfile } from "@/stores/userProfile";

import { useMediaQuery } from "@/hooks/use-media-query";
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
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { PawPrint } from "lucide-react";
import { translateSpecies } from "@/utils/translateSpecies";
import { useState } from "react";
import { EditPetDrawer } from "./EditPetDrawer";

function PetsTable() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const isMobile = useMediaQuery("(max-width: 640px)");
  const pets = useUserProfile((state) => state?.user?.pets) || [];
  const [selectedPet, setSelectedPet] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const handleRowClick = (pet: any) => {
    setSelectedPet(pet);
    setIsDrawerOpen(true);
  };

  console.log("table", pets);

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
              {pets.map((pet, index) => (
                <motion.tr
                  key={pet.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.3 }}
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
                    <div className="truncate">{pet.name}</div>
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
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell
                  colSpan={3}
                  className={`text-right ${isMobile ? "text-sm" : ""}`}
                >
                  Total de mascotas: {pets.length}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
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

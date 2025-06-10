"use client";

import { useUserProfile } from "@/stores/userProfile";
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
import { EditPetDrawer } from "./EditPetDrawer";
import { NewPetDrawer } from "./NewPetDrawer";
import { motion } from "framer-motion";
import { PawPrint, Award } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { translateSpecies } from "@/utils/translateSpecies";

function Pets() {
  const pets = useUserProfile((state) => state?.user?.pets);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [selectedPet, setSelectedPet] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const totalPets = pets?.length || 0;
  const petTypes =
    pets?.reduce(
      (acc, pet) => {
        const species = translateSpecies(pet.species) || "Sin especificar";
        acc[species] = (acc[species] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    ) || {};

  const mostCommonType = Object.entries(petTypes).sort(
    ([, a], [, b]) => b - a
  )[0];

  const handleRowClick = (pet: any) => {
    setSelectedPet(pet);
    setIsDrawerOpen(true);
  };

  return (
    <motion.div
      className="p-4 md:p-6 max-w-7xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-2">
          <PawPrint className="h-6 w-6 text-primary" />
          <h2 className="font-bold text-2xl md:text-3xl">Mis mascotas</h2>
        </div>
        <NewPetDrawer />
      </motion.div>

      {pets && pets.length > 0 ? (
        <div
          className={`grid gap-6 ${isDesktop ? "grid-cols-4" : "grid-cols-1"}`}
        >
          {/* Statistics Panel - Only on desktop */}
          {isDesktop && (
            <motion.div
              className="col-span-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Estadísticas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">
                      {totalPets}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total de mascotas
                    </div>
                  </div>

                  {mostCommonType && (
                    <div className="text-center">
                      <div className="text-xl font-semibold">
                        {mostCommonType[0]}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Tipo más común
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Tipos de mascotas:</h4>
                    {Object.entries(petTypes).map(([type, count]) => (
                      <div
                        key={type}
                        className="flex justify-between items-center"
                      >
                        <span className="text-sm">{type}</span>
                        <Badge variant="secondary">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Main Content - Table for all devices */}
          <div className={`${isDesktop ? "col-span-3" : "col-span-1"}`}>
            <motion.div
              className="rounded-lg border overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {/* Mobile instruction */}
              {isMobile && (
                <div className="bg-muted/50 px-4 py-2 text-xs text-muted-foreground text-center border-b">
                  Toca cualquier mascota para ver sus detalles
                </div>
              )}

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead
                        className={`${isMobile ? "w-[60px]" : "w-[80px]"}`}
                      >
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
                              {translateSpecies(pet.species) ||
                                "Sin especificar"}
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

            {/* Statistics for mobile and tablet */}
            {!isDesktop && (
              <motion.div
                className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">
                      {totalPets}
                    </div>
                    <div className="text-sm text-muted-foreground">Total</div>
                  </CardContent>
                </Card>
                {Object.entries(petTypes)
                  .slice(0, 3)
                  .map(([type, count]) => (
                    <Card key={type}>
                      <CardContent className="p-4 text-center">
                        <div className="text-xl font-semibold">{count}</div>
                        <div className="text-sm text-muted-foreground truncate">
                          {type}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </motion.div>
            )}
          </div>
        </div>
      ) : (
        <motion.div
          className="flex flex-col items-center justify-center p-10 bg-muted/20 rounded-lg border border-dashed"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <PawPrint className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
          <p className="text-lg text-muted-foreground text-center mb-6">
            No tienes mascotas registradas.
          </p>
          <NewPetDrawer />
        </motion.div>
      )}

      {/* Hidden EditPetDrawer that gets triggered programmatically */}
      {selectedPet && (
        <EditPetDrawer
          pet={selectedPet}
          open={isDrawerOpen}
          onOpenChange={setIsDrawerOpen}
        />
      )}
    </motion.div>
  );
}

export default Pets;

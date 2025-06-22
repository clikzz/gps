"use client";

import { useUserProfile } from "@/stores/userProfile";
import { EditPetDrawer } from "@/components/pets/EditPetDrawer";
import { NewPetDrawer } from "@/components/pets/NewPetDrawer";
import { motion } from "framer-motion";
import { PawPrint } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";

import { useState } from "react";
import PetsStats from "@/components/pets/PetsStats";
import PetsTable from "@/components/pets/PetsTable";

function Pets() {
  const pets = useUserProfile((state) => state?.user?.Pets);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [selectedPet] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isNewPetDrawerOpen, setIsNewPetDrawerOpen] = useState(false);

  return (
    <motion.div
      className="max-w-7xl mx-auto"
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
        <NewPetDrawer
          open={isNewPetDrawerOpen}
          onOpenChange={setIsNewPetDrawerOpen}
        />
      </motion.div>

      {pets && pets.length > 0 ? (
        <div
          className={`grid gap-6 ${isDesktop ? "grid-cols-4" : "grid-cols-1"}`}
        >
          {isDesktop && <PetsStats />}
          <PetsTable />
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
        </motion.div>
      )}

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

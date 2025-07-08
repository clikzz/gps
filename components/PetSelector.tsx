"use client";

import { useUserProfile } from "@/stores/userProfile";
import { useActivePet } from "@/stores/activePet";
import { useMediaQuery } from "@/hooks/use-media-query";
import { motion } from "framer-motion";
import { PawPrint, Plus, Heart } from "lucide-react";
import { translateSpecies } from "@/utils/translateSpecies";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function PetSelector() {
  const pets = useUserProfile((state) => state.user?.Pets);
  const setActivePet = useActivePet((state) => state.setActivePet);
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(min-width: 641px) and (max-width: 1024px)");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
      },
    },
  };

  const cardVariants = {
    hover: {
      scale: 1.03,
      y: -4,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
      },
    },
    tap: {
      scale: 0.98,
    },
  };

  const imageVariants = {
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  };

  const FloatingElements = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 bg-muted/15 rounded-full"
          initial={{
            x:
              Math.random() *
              (typeof window !== "undefined" ? window.innerWidth : 1000),
            y:
              Math.random() *
              (typeof window !== "undefined" ? window.innerHeight : 1000),
          }}
          animate={{
            y: [
              null,
              Math.random() *
                (typeof window !== "undefined" ? window.innerHeight : 1000),
            ],
            x: [
              null,
              Math.random() *
                (typeof window !== "undefined" ? window.innerWidth : 1000),
            ],
          }}
          transition={{
            duration: Math.random() * 25 + 15,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            ease: "linear",
          }}
        />
      ))}
    </div>
  );

  const getGridClasses = () => {
    const petCount = pets?.length || 0;

    if (isMobile) {
      return "grid-cols-2 gap-3";
    } else if (isTablet) {
      if (petCount <= 6) return "grid-cols-3 gap-4";
      return "grid-cols-4 gap-3";
    } else {
      if (petCount <= 4) return "grid-cols-2 lg:grid-cols-4 gap-6";
      if (petCount <= 8) return "grid-cols-3 lg:grid-cols-4 gap-5";
      if (petCount <= 12) return "grid-cols-4 lg:grid-cols-6 gap-4";
      return "grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3";
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-gradient-to-br from-background via-muted to-background flex flex-col overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Elementos flotantes de fondo */}
      <FloatingElements />

      {/* Gradiente overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/40" />

      {pets && pets.length > 0 ? (
        <div className="relative flex flex-col h-full">
          {/* Header fijo */}
          <motion.div
            className="flex-shrink-0 text-center px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-4 sm:pb-6"
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              className="inline-flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 mt-10"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="p-2 sm:p-3 bg-primary/10 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-border/50">
                <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent">
                ¿Quién está aquí?
              </h1>
            </motion.div>
            <motion.p
              className="text-muted-foreground text-sm sm:text-base lg:text-lg max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              Selecciona el perfil de tu mascota para continuar
            </motion.p>
          </motion.div>

          {/* Contenedor scrollable para las mascotas */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-6 lg:px-8 pb-6 mt-10">
            <div className="max-w-7xl mx-auto">
              <motion.div
                className={`grid ${getGridClasses()} justify-items-center`}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {pets?.map((pet, index) => (
                  <motion.button
                    key={pet.id}
                    className="group relative w-full focus:outline-none focus:ring-2 focus:ring-ring/30 rounded-2xl overflow-hidden"
                    onClick={() => setActivePet(pet)}
                    variants={itemVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <motion.div
                      className="relative bg-card/80 backdrop-blur-md border border-border hover:border-border/80 rounded-2xl p-3 sm:p-4 transition-all duration-300 hover:bg-card/90 hover:shadow-lg hover:shadow-primary/5"
                      variants={cardVariants}
                    >
                      {/* Efecto de brillo en hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />

                      {/* Status badge */}
                      {pet.active === false && (
                        <motion.div
                          className="absolute top-2 right-2 z-10"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 + index * 0.05 }}
                        >
                          <Badge
                            variant="destructive"
                            className="text-xs px-1.5 py-0.5"
                          >
                            Inactivo
                          </Badge>
                        </motion.div>
                      )}

                      {/* Imagen de la mascota - formato cuadrado */}
                      <motion.div
                        className="relative mb-2 sm:mb-3"
                        variants={imageVariants}
                      >
                        {pet.photo_url ? (
                          <div className="relative aspect-square overflow-hidden rounded-xl ring-1 ring-border group-hover:ring-primary/50 transition-all duration-300 w-16 sm:w-20 md:w-24 mx-auto">
                            <motion.img
                              src={pet.photo_url}
                              alt={pet.name}
                              className="absolute inset-0 w-full h-full object-cover object-center"
                              whileHover={{ scale: 1.05 }}
                              transition={{ duration: 0.3 }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                        ) : (
                          <motion.div
                            className="aspect-square w-16 sm:w-20 md:w-24 mx-auto bg-muted/50 flex items-center justify-center rounded-xl border border-dashed border-border group-hover:border-primary/50 group-hover:bg-muted/70 transition-all duration-300"
                            whileHover={{ scale: 1.03 }}
                          >
                            <PawPrint className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-muted-foreground group-hover:text-foreground transition-colors duration-300" />
                          </motion.div>
                        )}
                      </motion.div>

                      {/* Información de la mascota - más compacta */}
                      <motion.div
                        className="text-center space-y-1"
                        initial={{ opacity: 0.8 }}
                        whileHover={{ opacity: 1 }}
                      >
                        <h3 className="text-foreground text-sm sm:text-base font-bold group-hover:text-primary transition-colors duration-300 line-clamp-1">
                          {pet.name}
                        </h3>
                        {pet.species && (
                          <motion.div
                            className="flex justify-center"
                            whileHover={{ scale: 1.02 }}
                          >
                            <Badge
                              variant="secondary"
                              className="text-xs px-2 py-0.5 group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20 transition-all duration-300"
                            >
                              {translateSpecies(pet.species)}
                            </Badge>
                          </motion.div>
                        )}
                      </motion.div>

                      {/* Indicador de selección */}
                      <motion.div
                        className="absolute bottom-2 right-2 w-2 h-2 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={{ scale: 0 }}
                        whileHover={{ scale: 1 }}
                      />
                    </motion.div>
                  </motion.button>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Footer fijo */}
          <motion.div
            className="flex-shrink-0 text-center px-4 sm:px-6 lg:px-8 py-4 sm:py-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <motion.p
              className="text-muted-foreground text-xs sm:text-sm mb-2"
              whileHover={{ color: "hsl(var(--foreground))" }}
            >
              Haz clic en el perfil de tu mascota para continuar
            </motion.p>
            <motion.div
              className="flex items-center justify-center gap-2 text-muted-foreground text-xs"
              whileHover={{ scale: 1.05 }}
            >
              <Heart className="h-3 w-3 text-primary" />
              <span>Hecho con amor para tus mascotas</span>
            </motion.div>
          </motion.div>
        </div>
      ) : (
        /* Estado vacío - sin cambios */
        <motion.div
          className="relative text-center max-w-2xl mx-auto px-4 sm:px-6 flex-1 flex flex-col justify-center"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <motion.div
            className="mb-8 sm:mb-12"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="relative mx-auto w-32 h-32 sm:w-40 sm:h-40 mb-6 sm:mb-8">
              <div className="absolute inset-0 bg-muted/50 rounded-full flex items-center justify-center border-4 border-dashed border-border">
                <PawPrint className="h-16 w-16 sm:h-20 sm:w-20 text-muted-foreground" />
              </div>
              <motion.div
                className="absolute -top-2 -right-2 w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.1, rotate: 10 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Plus className="h-6 w-6 text-primary-foreground" />
              </motion.div>
            </div>
          </motion.div>

          <motion.h1
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            ¡Tu primera mascota te espera!
          </motion.h1>

          <motion.p
            className="text-muted-foreground text-base sm:text-lg mb-8 sm:mb-10 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            Parece que aún no has registrado ninguna mascota.
            <br className="hidden sm:block" />
            ¡Añade tu primera compañera peluda para comenzar!
          </motion.p>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Link href="/pets">
              <Button
                size="lg"
                className="shadow-xl hover:shadow-2xl transition-all duration-300 px-8 py-3 text-base sm:text-lg font-semibold"
              >
                <Plus className="mr-2 h-5 w-5" />
                Añadir Mi Primera Mascota
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default PetSelector;

"use client";
import { useUserProfile } from "@/stores/userProfile";
import { useActivePet } from "@/stores/activePet";
import { motion } from "framer-motion";
import { PawPrint } from "lucide-react";
import { translateSpecies } from "@/utils/translateSpecies";

function PetSelector() {
  const pets = useUserProfile((state) => state.user?.pets);
  const setActivePet = useActivePet((state) => state.setActivePet);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const profileVariants = {
    hover: {
      scale: 1.1,
      y: -10,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
    tap: {
      scale: 0.95,
    },
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-6xl mx-auto px-4 py-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            ¿Quién está aquí?
          </h1>
          <p className="text-slate-300 text-lg">
            Selecciona el perfil de tu mascota
          </p>
        </motion.div>

        <motion.div
          className="flex flex-wrap justify-center gap-8 md:gap-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {pets?.map((pet) => (
            <motion.button
              key={pet.id}
              className="group flex flex-col items-center focus:outline-none focus:ring-4 focus:ring-primary/50 rounded-2xl p-4"
              onClick={() => setActivePet(pet)}
              variants={itemVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <motion.div className="relative mb-4" variants={profileVariants}>
                {pet.photo_url ? (
                  <div className="relative">
                    <img
                      src={pet.photo_url || "/placeholder.svg"}
                      alt={pet.name}
                      className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-2xl border-4 border-transparent group-hover:border-primary transition-colors duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-2xl transition-colors duration-300" />
                  </div>
                ) : (
                  <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center rounded-2xl border-4 border-transparent group-hover:border-primary transition-colors duration-300">
                    <PawPrint className="h-16 w-16 md:h-20 md:w-20 text-slate-300" />
                  </div>
                )}
              </motion.div>

              <motion.div
                className="text-center"
                initial={{ opacity: 0.8 }}
                whileHover={{ opacity: 1 }}
              >
                <h3 className="text-white text-xl md:text-2xl font-semibold group-hover:text-primary transition-colors duration-300">
                  {pet.name}
                </h3>
                {pet.species && (
                  <p className="text-slate-400 text-sm md:text-base mt-1 group-hover:text-slate-300 transition-colors duration-300">
                    {translateSpecies(pet.species)}
                  </p>
                )}
              </motion.div>
            </motion.button>
          ))}
        </motion.div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <p className="text-slate-400 text-sm">
            Haz clic en el perfil de tu mascota para continuar
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default PetSelector;

"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useDeleteTimelineEntry } from "@/hooks/timeline/useDeleteTimeline"
import { useTimelineData } from "@/hooks/timeline/useTimelineData"
import TimelineMemoryCard from "@/components/timeline/TimelineMemoryCard"
import { useActivePet } from "@/stores/activePet"                            // Nicolás pidió usar mascota activa → import useActivePet
import NewTimelineDrawer from "@/components/timeline/NewTimelineDrawer" 


interface TimelineEntriesListProps {
  startDate?: string
  endDate?: string
  milestoneId?: string
  reloadSignal?: number
}

const TAKE = 10

function parseEventDateLocal(input: string | Date): Date {
  if (typeof input === "string") {
    const [y, m, d] = input.split("T")[0].split("-").map(Number)
    return new Date(y, m - 1, d)
  }
  return new Date(input)
}

// Variantes de animación para el contenedor principal
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      staggerChildren: 0.1,
    },
  },
}

// Variantes para el título
const titleVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
}

// Variantes para la grilla de tarjetas
const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
      staggerChildren: 0.08,
    },
  },
}

// Variantes para estados de carga y error
const stateVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
}

// Variantes para la paginación
const paginationVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: 0.2 },
  },
}

export default function TimelineEntriesList({
  startDate,
  endDate,
  milestoneId,
  reloadSignal,
}: TimelineEntriesListProps) {
  // → Hooks en orden fijo
  const activePet = useActivePet((state) => state.activePet)                // Nicolás pidió obtener mascota activa → useActivePet
  const petId = activePet?.id ?? ""                                         // Nicolás pidió ID garantizado → petId desde activePet
  if (!petId) {                                                             // Nicolás pidió no renderizar sin petId → guard
    return null
  }

  const [page, setPage] = useState(0)                                        // Nicolás pidió paginación
  const skip = page * TAKE

  const { entries, total, isLoading, error, mutateEntries } = useTimelineData(
    petId,
    { startDate, endDate, milestoneId, skip, take: TAKE }
  )
  const { isDeleting, deleteEntry } = useDeleteTimelineEntry(petId)        // Nicolás pidió delete con petId activo → deleteEntry

  // Nicolás pidió función para eliminar entradas → definimos handleDelete
  const handleDelete = async (entryId: string) => {                       // Nicolás pidió handleDelete → función para borrar y refrescar
    await deleteEntry(entryId)
    mutateEntries()
  }

  useEffect(() => {
    if (reloadSignal !== undefined) mutateEntries()
  }, [reloadSignal, mutateEntries])

  useEffect(() => {
    setPage(0)
  }, [startDate, endDate, milestoneId])

  const totalPages = Math.ceil(total / TAKE)

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <div className="flex items-center justify-between mt-6 mb-4">
        <motion.h3 className="text-xl font-semibold" variants={titleVariants}>
          Recuerdos
        </motion.h3>
        <NewTimelineDrawer
          petId={petId}
          onSuccess={() => mutateEntries()}            // Refresca al añadir un recuerdo
        />
      </div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            className="text-center py-10"
            variants={stateVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="inline-block w-6 h-6 border-2 border-primary border-t-transparent rounded-full mb-2"
            />
            <p>Cargando...</p>
          </motion.div>
        ) : error ? (
          <motion.div
            key="error"
            className="text-center py-10 text-destructive"
            variants={stateVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            Error al cargar los recuerdos.
          </motion.div>
        ) : entries.length === 0 ? (
          <motion.div
            key="empty"
            className="text-center py-10 px-4 border border-dashed rounded-lg"
            variants={stateVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <motion.p
              className="text-muted-foreground"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Aún no hay recuerdos para esta mascota.
            </motion.p>
            <motion.p
              className="text-sm text-muted-foreground/80"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              ¡Añade el primero para empezar a construir su historia!
            </motion.p>
          </motion.div>
        ) : (
          <motion.div key="content">
            <motion.div
              className="grid grid-cols-1 gap-6"
              variants={gridVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence>
                {entries.map((entry, index) => (
                  <TimelineMemoryCard
                    key={entry.id}
                    entry={entry}
                    onDelete={() => handleDelete(entry.id)}
                    isDeleting={isDeleting}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </motion.div>

            <motion.div className="flex justify-center gap-2 mt-6" variants={paginationVariants}>
              <motion.button
                onClick={() => setPage((p) => Math.max(p - 1, 0))}
                disabled={page === 0}
                className="px-3 py-1 rounded border transition-colors hover:bg-muted disabled:opacity-50"
                whileHover={{ scale: page === 0 ? 1 : 1.05 }}
                whileTap={{ scale: page === 0 ? 1 : 0.95 }}
              >
                Anterior
              </motion.button>
              <span className="px-2 py-1 text-sm">
                Página {page + 1} de {totalPages}
              </span>
              <motion.button
                onClick={() => setPage((p) => (p + 1 < totalPages ? p + 1 : p))}
                disabled={page + 1 >= totalPages}
                className="px-3 py-1 rounded border transition-colors hover:bg-muted disabled:opacity-50"
                whileHover={{ scale: page + 1 >= totalPages ? 1 : 1.05 }}
                whileTap={{ scale: page + 1 >= totalPages ? 1 : 0.95 }}
              >
                Siguiente
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

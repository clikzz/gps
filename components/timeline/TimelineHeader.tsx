"use client"
import type { Pets as Pet } from "@prisma/client"
import { calculateAge } from "@/utils/calculateAge"
import { PawPrint, Info } from "lucide-react"
import Image from "next/image"
import type React from "react"
import { motion } from "framer-motion"

interface PetTimelineHeaderProps {
  petData: Pet
  startDate: string
  endDate: string
  onStartDateChange: (date: string) => void
  onEndDateChange: (date: string) => void
  milestones: { id: string; name: string; icon_url: string | null }[]
  selectedMilestone: string
  onMilestoneChange: (id: string) => void
}

// Variantes para el contenedor principal
const containerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1,
    },
  },
}

// Variantes para elementos individuales
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
}

// Variantes para la imagen/avatar
const avatarVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
}

// Variantes para los filtros
const filtersVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      staggerChildren: 0.05,
    },
  },
}

export default function PetTimelineHeader({
  petData,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  milestones,
  selectedMilestone,
  onMilestoneChange,
  children,
}: PetTimelineHeaderProps & { children?: React.ReactNode }) {
  const age = petData.date_of_birth ? calculateAge(petData.date_of_birth) : null

  function getTodayLocalISO() {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, "0")
    const day = String(now.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const today = getTodayLocalISO()

  return (
    <motion.div
      className="w-full flex flex-col gap-4 py-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="flex items-center justify-between" variants={itemVariants}>
        <div className="flex items-center gap-4">
          <motion.div variants={avatarVariants}>
            {petData.photo_url ? (
              <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                <Image
                  src={petData.photo_url || "/placeholder.svg"}
                  alt={`Foto de ${petData.name}`}
                  width={80}
                  height={80}
                  className="rounded-full object-cover w-20 h-20 border-2"
                />
              </motion.div>
            ) : (
              <motion.div
                className="w-20 h-20 rounded-full bg-muted flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <PawPrint className="w-10 h-10 text-muted-foreground" />
              </motion.div>
            )}
          </motion.div>

          <motion.div variants={itemVariants}>
            <motion.h1
              className="text-2xl font-bold"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              Timeline de {petData.name}
            </motion.h1>
            <motion.p
              className="text-md text-muted-foreground"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              {age !== null ? `${age} años` : "Edad no especificada"}
            </motion.p>
          </motion.div>
        </div>

        <motion.div className="flex-shrink-0" variants={itemVariants}>
          {children}
        </motion.div>
      </motion.div>

      <motion.div className="border-b pb-4" variants={itemVariants}>
        <motion.div className="flex flex-wrap items-start gap-6" variants={filtersVariants}>
          <motion.div className="flex flex-col" variants={itemVariants}>
            <label htmlFor="startDate" className="text-xs font-medium">
              Desde
            </label>
            <motion.input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              max={endDate || undefined}
              className="mt-1 block w-full rounded border px-2 py-1 bg-background transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary"
              whileFocus={{ scale: 1.02 }}
            />
          </motion.div>

          <motion.div className="flex flex-col" variants={itemVariants}>
            <label htmlFor="endDate" className="text-xs font-medium">
              Hasta
            </label>
            <motion.input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              min={startDate || undefined}
              max={today}
              className="mt-1 block w-full rounded border px-2 py-1 bg-background transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary"
              whileFocus={{ scale: 1.02 }}
            />
          </motion.div>

          <motion.div className="flex flex-col" variants={itemVariants}>
            <label htmlFor="milestones" className="flex items-center text-xs font-medium">
              Hito
              <motion.span
                className="ml-1 cursor-pointer"
                title="Si seleccionas un hito, solo verás los recuerdos que lo incluyan."
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Info className="w-4 h-4 text-muted-foreground" />
              </motion.span>
            </label>
            <motion.select
              id="milestones"
              value={selectedMilestone}
              onChange={(e) => onMilestoneChange(e.target.value)}
              className="mt-1 block w-full rounded border px-2 py-1 bg-background transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary"
              whileFocus={{ scale: 1.02 }}
            >
              <option value="">Todos los hitos</option>
              {milestones.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </motion.select>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

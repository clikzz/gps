"use client"
import type { Pets as Pet } from "@prisma/client"
import { calculateAge } from "@/utils/calculateAge"
import { PawPrint, Info, Calendar as CalendarIcon } from "lucide-react"
import Image from "next/image"
import type React from "react"
import { motion } from "framer-motion"
import RangeCalendar from "@/components/ui/rangecalendar"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"


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


const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
}


const avatarVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
}


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

  const [open, setOpen] = useState(false)
const wrapperRef = useRef<HTMLDivElement>(null)

useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
      setOpen(false)
    }
  }
  document.addEventListener("mousedown", handleClickOutside)
  return () => document.removeEventListener("mousedown", handleClickOutside)
}, [])

function parseLocalDate(iso: string): Date {
  const [year, month, day] = iso.split("-")
  return new Date(Number(year), Number(month) - 1, Number(day))
}

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
      <label htmlFor="dateRange" className="text-xs font-medium">
        Rango de fechas
      </label>
      <div ref={wrapperRef} className="relative mt-1">
        <Button
  variant="outline"
  onClick={() => setOpen(o => !o)}
  className="w-full justify-start"
  type="button"
>
  <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
  {startDate && endDate
    ? `${parseLocalDate(startDate).toLocaleDateString("es-ES")} - ${parseLocalDate(endDate).toLocaleDateString("es-ES")}`
    : "-- / -- / --"}
</Button>
        <div
  className={`absolute z-50 mt-2 transform left-0 transition ease-out duration-150 origin-top-left ${
    open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
  }`}
>
  <div className="w-[600px]">
    <RangeCalendar
      initialStartDate={startDate ? new Date(startDate) : null}
      initialEndDate={endDate ? new Date(endDate) : null}
      maxDate={new Date(today)}
      onDateRangeSelect={(s,e) => {
        onStartDateChange(s ? s.toISOString().split("T")[0] : "")
        onEndDateChange(e ? e.toISOString().split("T")[0] : "")
        setOpen(false)
      }}
    />
  </div>
</div>
      </div>
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

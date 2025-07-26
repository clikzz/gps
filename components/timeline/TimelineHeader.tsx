"use client"

import React from "react"
import type { Pets as Pet } from "@prisma/client"
import { calculateAge } from "@/utils/calculateAge"
import { PawPrint, Info, CalendarIcon, ChevronDown, X, MapPin, Heart, Calendar, Users, Gift } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"
import RangeCalendar from "@/components/ui/rangecalendar"
import { useState, useRef, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

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


function MilestoneDropdownSection({
  title,
  icon: Icon,
  milestones,
  selectedMilestone,
  onMilestoneSelect,
  isFirst = false,
}: {
  title: string
  icon: React.ComponentType<{ className?: string }>
  milestones: Array<{ id: string; name: string }>
  selectedMilestone: string
  onMilestoneSelect: (id: string) => void
  isFirst?: boolean
}) {
  if (milestones.length === 0) return null

  return (
    <div className={cn("space-y-2", !isFirst && "border-t pt-3")}>
      <div className="flex items-center gap-2 px-3 py-1">
        <Icon className="w-3 h-3 text-muted-foreground" />
        <h4 className="text-xs font-medium text-muted-foreground">{title}</h4>
      </div>
      <div className="space-y-1">
        {milestones.map((milestone) => (
          <button
            key={milestone.id}
            type="button"
            onClick={() => onMilestoneSelect(milestone.id)}
            className={cn(
              "w-full text-left px-3 py-2 text-sm rounded-md transition-colors",
              "hover:bg-accent hover:text-accent-foreground",
              selectedMilestone === milestone.id ? "bg-primary text-primary-foreground" : "text-foreground",
            )}
          >
            {milestone.name}
          </button>
        ))}
      </div>
    </div>
  )
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
}: PetTimelineHeaderProps & { children?: any }) {
  const age = petData.date_of_birth ? calculateAge(petData.date_of_birth) : null

  function getTodayLocalISO() {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, "0")
    const day = String(now.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const today = getTodayLocalISO()
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [milestonesOpen, setMilestonesOpen] = useState(false)
  const calendarWrapperRef = useRef<HTMLDivElement>(null)
  const milestonesWrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calendarWrapperRef.current && !calendarWrapperRef.current.contains(event.target as Node)) {
        setCalendarOpen(false)
      }
      if (milestonesWrapperRef.current && !milestonesWrapperRef.current.contains(event.target as Node)) {
        setMilestonesOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function parseLocalDate(iso: string): Date {
    const [year, month, day] = iso.split("-")
    return new Date(Number(year), Number(month) - 1, Number(day))
  }


  const milestonesSections = useMemo(() => {
    if (!milestones || milestones.length === 0) return []

    const sections = [
      {
        title: "Lugares",
        icon: MapPin,
        milestoneIds: ["1", "2", "3", "4", "5"],
      },
      {
        title: "Cuidado y Salud",
        icon: Heart,
        milestoneIds: ["6", "7", "8", "9"], 
      },
      {
        title: "Celebraciones y Fechas",
        icon: Calendar,
        milestoneIds: ["10", "11", "12", "13", "14", "15"], 
      },
      {
        title: "Personas y Relaciones",
        icon: Users,
        milestoneIds: ["16", "17"], 
      },
      {
        title: "Objetos, Logros y Novedades",
        icon: Gift,
        milestoneIds: ["18", "19", "20"], 
      },
    ]

    return sections.map((section) => ({
      ...section,
      milestones: section.milestoneIds
        .map((id) => milestones.find((m) => m.id === id))
        .filter((milestone) => milestone !== undefined)
        .map((milestone) => milestone!),
    }))
  }, [milestones])


  const selectedMilestoneData = milestones.find((m) => m.id === selectedMilestone)

  const handleMilestoneSelect = (id: string) => {
    onMilestoneChange(id)
    setMilestonesOpen(false)
  }

  const clearMilestoneFilter = () => {
    onMilestoneChange("")
    setMilestonesOpen(false)
  }

  return (
    <motion.div
      className="w-full flex flex-col gap-4 py-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="flex items-center justify-between gap-2" variants={itemVariants}>
        <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
          <motion.div variants={avatarVariants} className="flex-shrink-0">
            {petData.photo_url ? (
              <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                <Image
                  src={petData.photo_url || "/placeholder.svg"}
                  alt={`Foto de ${petData.name}`}
                  width={56}
                  height={56}
                  className="rounded-full object-cover w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 border-2 aspect-square"
                />
              </motion.div>
            ) : (
              <motion.div
                className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-muted flex items-center justify-center aspect-square"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <PawPrint className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-muted-foreground" />
              </motion.div>
            )}
          </motion.div>
          <motion.div variants={itemVariants} className="flex-1 min-w-0">
            <motion.h1
              className="text-base sm:text-lg md:text-xl font-bold leading-tight truncate"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              Timeline de {petData.name}
            </motion.h1>
            <motion.p
              className="text-xs sm:text-sm md:text-base text-muted-foreground"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              {age !== null ? `${age} años` : "Edad no especificada"}
            </motion.p>
          </motion.div>
        </div>
        <motion.div className="flex-shrink-0" variants={itemVariants}>
          <div className="sm:hidden">
            {children &&
              React.cloneElement(children as any, {
                className:
                  "px-2 py-1 text-xs h-auto min-h-[2.5rem] flex flex-col items-center justify-center leading-tight whitespace-nowrap",
                children: (
                  <span className="text-center leading-tight">
                    Cambiar
                    <br />
                    mascota
                  </span>
                ),
              })}
          </div>
          <div className="hidden sm:block">{children}</div>
        </motion.div>
      </motion.div>

      <motion.div className="border-b pb-4" variants={itemVariants}>
        <motion.div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4" variants={filtersVariants}>
          <motion.div className="flex flex-col w-full sm:w-auto" variants={itemVariants}>
            <label htmlFor="dateRange" className="text-xs font-medium mb-1">
              Rango de fechas
            </label>
            <div ref={calendarWrapperRef} className="relative">
              <Button
                variant="outline"
                onClick={() => setCalendarOpen((o) => !o)}
                className="w-full sm:w-auto justify-start text-xs sm:text-sm h-9"
                type="button"
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="truncate">
                  {startDate && endDate
                    ? `${parseLocalDate(startDate).toLocaleDateString("es-ES")} - ${parseLocalDate(endDate).toLocaleDateString("es-ES")}`
                    : "-- / -- / --"}
                </span>
              </Button>
              <div
                className={`absolute z-50 mt-2 transform left-0 transition ease-out duration-150 origin-top-left ${
                  calendarOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
                }`}
              >
                <div className="w-[280px] sm:w-[300px] md:w-[600px]">
                  <RangeCalendar
                    initialStartDate={startDate ? new Date(startDate) : null}
                    initialEndDate={endDate ? new Date(endDate) : null}
                    maxDate={new Date(today)}
                    onDateRangeSelect={(s, e) => {
                      onStartDateChange(s ? s.toISOString().split("T")[0] : "")
                      onEndDateChange(e ? e.toISOString().split("T")[0] : "")
                      setCalendarOpen(false)
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div className="flex flex-col w-full sm:w-auto" variants={itemVariants}>
            <label htmlFor="milestones" className="flex items-center text-xs font-medium mb-1">
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
            <div ref={milestonesWrapperRef} className="relative">
              <Button
                variant="outline"
                onClick={() => setMilestonesOpen((o) => !o)}
                className="w-full sm:w-auto justify-between text-xs sm:text-sm h-9 min-w-[180px]"
                type="button"
              >
                <span className="truncate">
                  {selectedMilestoneData ? selectedMilestoneData.name : "Todos los hitos"}
                </span>
                <div className="flex items-center gap-1 ml-2">
                  {selectedMilestone && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        clearMilestoneFilter()
                      }}
                      className="hover:bg-muted rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                  <ChevronDown className={cn("w-4 h-4 transition-transform", milestonesOpen && "rotate-180")} />
                </div>
              </Button>

              <div
                className={cn(
                  "absolute z-50 mt-2 w-full sm:w-80 bg-popover border rounded-md shadow-lg",
                  "transform transition ease-out duration-150 origin-top-left",
                  milestonesOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none",
                )}
              >
                <div className="p-2 max-h-96 overflow-y-auto">

                  <button
                    type="button"
                    onClick={() => clearMilestoneFilter()}
                    className={cn(
                      "w-full text-left px-3 py-2 text-sm rounded-md transition-colors mb-2",
                      "hover:bg-accent hover:text-accent-foreground font-medium",
                      !selectedMilestone ? "bg-primary text-primary-foreground" : "text-foreground",
                    )}
                  >
                    Todos los hitos
                  </button>

                  <div className="border-t pt-2 space-y-0">
                    {milestonesSections.map((section, index) => (
                      <MilestoneDropdownSection
                        key={section.title}
                        title={section.title}
                        icon={section.icon}
                        milestones={section.milestones}
                        selectedMilestone={selectedMilestone}
                        onMilestoneSelect={handleMilestoneSelect}
                        isFirst={index === 0}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

"use client"
import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { motion } from "framer-motion"
import TimelineHeader from "@/components/timeline/TimelineHeader"
import TimelineEntriesList from "@/components/timeline/TimelineEntriesList"
import { useTimelineData } from "@/hooks/timeline/useTimelineData"
import { useMilestones } from "@/hooks/timeline/useMilestones"
import { PawPrint, Heart } from "lucide-react"
import { useActivePet } from "@/stores/activePet"
import { Button } from "@/components/ui/button"                                

const PetSelector = dynamic(() => import("@/components/PetSelector"), { ssr: false })

export default function PetTimelinePage() {
  const activePet = useActivePet((state) => state.activePet)
  const resetActivePet = useActivePet((state) => state.resetActivePet)
  const petId = activePet?.id ?? ""
  const { pet, isLoading: isLoadingData, error: dataError } = useTimelineData(petId)
  const { milestones, isLoading: isLoadingMilestones, error: milestonesError } = useMilestones()
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const [selectedMilestone, setSelectedMilestone] = useState<string>("")
  const [reloadSignal, setReloadSignal] = useState(0)

  if (!activePet?.id) {
    return <PetSelector />
  }

  const isLoading = isLoadingData || isLoadingMilestones
  const error = dataError || milestonesError

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8">

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            className="relative mb-6"
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <PawPrint className="w-8 h-8 text-primary" />
            </div>

            <motion.div
              className="absolute -top-2 -right-2"
              animate={{
                y: [-5, -15, -5],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: 0.5,
              }}
            >
              <Heart className="w-4 h-4 text-red-400 fill-current" />
            </motion.div>
          </motion.div>

          <motion.h3
            className="text-xl font-semibold text-foreground mb-2"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            Cargando timeline
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              ...
            </motion.span>
          </motion.h3>

          <motion.p
            className="text-muted-foreground text-sm mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Preparando los recuerdos de tu mascota
          </motion.p>

          <div className="w-48 h-1 bg-muted rounded-full overflow-hidden mx-auto mb-4">
            <motion.div
              className="h-full bg-primary rounded-full"
              animate={{
                x: [-200, 200],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              style={{ width: "50%" }}
            />
          </div>

          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4].map((dot) => (
              <motion.div
                key={dot}
                className="w-2 h-2 bg-primary rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: dot * 0.2,
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    )
  }

  if (error || !pet) {
    return (
      <motion.div
        className="text-center p-8 text-destructive"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        Error al cargar el timeline o la mascota no fue encontrada.
      </motion.div>
    )
  }

  return (
    <motion.div
      className="w-full px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <TimelineHeader
        petData={pet}
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        milestones={milestones}
        selectedMilestone={selectedMilestone}
        onMilestoneChange={setSelectedMilestone}
      >
        <Button
          variant="outline"
          size="sm"
          onClick={resetActivePet}
        >
          Cambiar mascota
        </Button>                                              
      </TimelineHeader>
      <TimelineEntriesList
        startDate={startDate}
        endDate={endDate}
        milestoneId={selectedMilestone}
        reloadSignal={reloadSignal}
      />
    </motion.div>
  )
}
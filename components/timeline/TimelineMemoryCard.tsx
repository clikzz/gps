"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import ConfirmationButton from "@/components/ConfirmationButton"
import CarouselStack from "@/components/ui/CarouselStack"
import { Calendar, Tag, ChevronDown, ChevronUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { TimelineEntryWithPhotos } from "@/types/timeline"
import { useState } from "react"
import { useMediaQuery } from "@/hooks/use-media-query"
import type { Milestones as Milestone } from "@prisma/client"
import { useActivePet } from "@/stores/activePet"
import NewTimelineDrawer from "@/components/timeline/NewTimelineDrawer"

function parseEventDateLocal(input: string | Date): Date {
  if (typeof input === "string") {
    const [y, m, d] = input.split("T")[0].split("-").map(Number)
    return new Date(y, m - 1, d)
  }
  return new Date(input)
}

export interface TimelineMemoryCardProps {
  entry: TimelineEntryWithPhotos
  onDelete: () => void
  isDeleting: boolean
  onEntryUpdate?: () => Promise<void>
  index?: number
}

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      delay: index * 0.08,
      ease: "easeOut",
    },
  }),
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -20,
    transition: { duration: 0.2 },
  },
}

const contentVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      staggerChildren: 0.05,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 5 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2 },
  },
}

const badgeVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.2 },
  },
}

const expandButtonVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3 },
  },
  hover: {
    scale: 1.05,
    transition: { duration: 0.2 },
  },
  tap: {
    scale: 0.95,
    transition: { duration: 0.1 },
  },
}

export default function TimelineMemoryCard({
  entry,
  onDelete,
  isDeleting,
  onEntryUpdate,
  index = 0,
}: TimelineMemoryCardProps) {
  const localDate = parseEventDateLocal(entry.event_date)
  const date = localDate.toLocaleDateString("es-CL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const [expanded, setExpanded] = useState(false)
  const isMobile = useMediaQuery("(max-width: 639px)")
  const isTablet = useMediaQuery("(min-width: 640px) and (max-width: 767px)")
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const activePet = useActivePet((state) => state.activePet)
  const petId = activePet?.id ?? ""

  const milestones: Milestone[] = entry.Milestones ?? []

  const getInitialVisibleCount = () => {
    if (isDesktop) return Math.min(milestones.length, 4)
    if (isTablet) return Math.min(milestones.length, 3)
    return Math.min(milestones.length, 2)
  }

  const initialVisibleCount = getInitialVisibleCount()
  const visibleCount = expanded ? milestones.length : initialVisibleCount
  const shown = milestones.slice(0, visibleCount)
  const hasMore = milestones.length > initialVisibleCount

  const toggleExpanded = () => {
    setExpanded(!expanded)
  }

  const handleEditSuccess = async () => {
    if (onEntryUpdate) {
      await onEntryUpdate()
    }
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      custom={index}
      layout
      whileHover={{
        y: -4,
        transition: { duration: 0.2, ease: "easeOut" },
      }}
    >
      <Card className="bg-card rounded-xl shadow-lg overflow-hidden mb-6 border-0 shadow-md hover:shadow-xl transition-shadow duration-300">
        <motion.div className="p-6 border-b" variants={contentVariants} initial="hidden" animate="visible" layout>
          <div className="flex items-start justify-between gap-x-4">
            <motion.div variants={itemVariants} layout>
              {entry.title && (
                <motion.h3
                  className="text-lg sm:text-xl font-bold text-foreground max-w-[50ch] whitespace-normal break-all leading-tight"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  layout
                >
                  {entry.title}
                </motion.h3>
              )}
              <motion.div className="flex items-center text-muted-foreground mt-1" variants={itemVariants} layout>
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span className="text-xs sm:text-sm">{date}</span>
              </motion.div>
            </motion.div>

            <motion.div className="flex flex-col items-end gap-2 max-w-[60%]" variants={contentVariants} layout>
              <motion.div
                className="flex flex-wrap items-center justify-end gap-2"
                layout
                transition={{
                  layout: {
                    duration: 0.4,
                    ease: "easeInOut",
                  },
                }}
              >
                {milestones.slice(0, initialVisibleCount).map((milestone, idx) => (
                  <motion.span
                    key={`${entry.id}-${milestone.id}`}
                    className="inline-flex items-center space-x-1 px-2 py-1 sm:px-3 sm:py-1 bg-muted rounded-full text-xs max-w-[8rem] sm:max-w-[10rem] whitespace-normal break-words"
                    variants={badgeVariants}
                    initial={{ opacity: 1, scale: 1 }}
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: "hsl(var(--muted) / 0.8)",
                    }}
                    transition={{ duration: 0.2 }}
                    layout
                    layoutId={`milestone-visible-${entry.id}-${milestone.id}`}
                  >
                    <Tag className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-foreground" />
                    <span className="text-foreground text-xs">{milestone.name}</span>
                  </motion.span>
                ))}

                <AnimatePresence mode="popLayout" key={`milestones-${entry.id}`}>
                  {expanded &&
                    milestones.slice(initialVisibleCount).map((milestone, idx) => (
                      <motion.span
                        key={`${entry.id}-${milestone.id}`}
                        className="inline-flex items-center space-x-1 px-2 py-1 sm:px-3 sm:py-1 bg-muted rounded-full text-xs max-w-[8rem] sm:max-w-[10rem] whitespace-normal break-words"
                        initial={{ opacity: 0, scale: 0.8, y: -10 }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                          y: 0,
                          transition: {
                            delay: idx * 0.05,
                            duration: 0.3,
                            ease: "easeOut",
                          },
                        }}
                        exit={{
                          opacity: 0,
                          scale: 0.8,
                          y: -10,
                          transition: {
                            duration: 0.2,
                            ease: "easeIn",
                          },
                        }}
                        whileHover={{
                          scale: 1.05,
                          backgroundColor: "hsl(var(--muted) / 0.8)",
                        }}
                        layout
                        layoutId={`milestone-${entry.id}-${milestone.id}`}
                      >
                        <Tag className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-foreground" />
                        <span className="text-foreground text-xs">{milestone.name}</span>
                      </motion.span>
                    ))}
                </AnimatePresence>
              </motion.div>

              {hasMore && (
                <motion.div
                  variants={expandButtonVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  whileTap="tap"
                  layout
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleExpanded}
                    className="h-7 px-2 sm:h-8 sm:px-3 text-xs font-medium rounded-full border border-border/50 hover:border-border hover:bg-muted/50 transition-all duration-200"
                    aria-expanded={expanded}
                    aria-label={
                      expanded ? "Ver menos hitos" : `Ver ${milestones.length - initialVisibleCount} hitos más`
                    }
                  >
                    <span className="mr-1">
                      {expanded ? "Ver menos" : `+${milestones.length - initialVisibleCount} más`}
                    </span>
                    {expanded ? (
                      <ChevronUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    ) : (
                      <ChevronDown className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    )}
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.div>

        <CardContent className="p-6">
          <motion.div
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            layout
            transition={{
              layout: {
                duration: 0.4,
                ease: "easeInOut",
              },
            }}
          >
            {entry.description && (
              <motion.p
                className="text-sm sm:text-base text-foreground mb-6 break-words leading-relaxed"
                variants={itemVariants}
                layout
              >
                {entry.description}
              </motion.p>
            )}
            <motion.div variants={itemVariants} layout>
              <CarouselStack images={entry.TimelineEntryPhotos?.map((p) => p.photo_url) ?? []} />
            </motion.div>
          </motion.div>
        </CardContent>

        <CardFooter className="justify-end space-x-2">
          <NewTimelineDrawer petId={petId} mode="edit" entryToEdit={entry} onSuccess={handleEditSuccess} />
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            layout
          >
            <ConfirmationButton
              onConfirm={async () => onDelete()}
              triggerText={isDeleting ? "Eliminando…" : "Eliminar"}
              dialogTitle="Confirmar eliminación"
              dialogDescription="¿Estás seguro? Esta acción no se puede deshacer."
              confirmText="Eliminar"
              cancelText="Cancelar"
              variant="destructive"
              size="sm"
            />
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

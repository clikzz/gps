"use client"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import ConfirmationButton from "@/components/ConfirmationButton"
import CarouselStack from "@/components/ui/CarouselStack"
import { Calendar, Tag } from "lucide-react"
import { motion } from "framer-motion"
import type { TimelineEntryWithPhotos } from "@/types/timeline"

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

export default function TimelineMemoryCard({ entry, onDelete, isDeleting, index = 0 }: TimelineMemoryCardProps) {
  const localDate = parseEventDateLocal(entry.event_date)
  const date = localDate.toLocaleDateString("es-CL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      custom={index}
      whileHover={{
        y: -4,
        transition: { duration: 0.2, ease: "easeOut" },
      }}
    >
      <Card className="bg-card rounded-xl shadow-lg overflow-hidden mb-6 border-0 shadow-md hover:shadow-xl transition-shadow duration-300">

        <motion.div className="p-6 border-b" variants={contentVariants} initial="hidden" animate="visible">
          <div className="flex items-start justify-between gap-x-4">
            <motion.div variants={itemVariants}>
              {entry.title && (
                <motion.h3
                  className="text-xl font-bold text-foreground max-w-[50ch] whitespace-normal break-all"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  {entry.title}
                </motion.h3>
              )}
              <motion.div className="flex items-center text-muted-foreground mt-1" variants={itemVariants}>
                <Calendar className="w-4 h-4 mr-1" />
                <span className="text-sm">{date}</span>
              </motion.div>
            </motion.div>


            <motion.div dir="rtl" className="grid grid-cols-2 gap-2 justify-items-start" variants={contentVariants}>
              {entry.Milestones?.map((tag, tagIndex) => (
                <motion.span
                  key={tag.id}
                  dir="ltr"
                  className="inline-flex items-center space-x-1 px-3 py-1 bg-muted rounded-full text-xs max-w-[10rem] whitespace-normal break-words"
                  variants={badgeVariants}
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: "hsl(var(--muted) / 0.8)",
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <Tag className="w-3 h-3 text-foreground" />
                  <span className="text-foreground">{tag.name}</span>
                </motion.span>
              ))}
            </motion.div>
          </div>
        </motion.div>


        <CardContent className="p-6">
          <motion.div variants={contentVariants} initial="hidden" animate="visible">
            {entry.description && (
              <motion.p className="text-foreground mb-6 break-words" variants={itemVariants}>
                {entry.description}
              </motion.p>
            )}
            <motion.div variants={itemVariants}>
              <CarouselStack images={entry.TimelineEntryPhotos?.map((p) => p.photo_url) ?? []} />
            </motion.div>
          </motion.div>
        </CardContent>


        <CardFooter className="justify-end">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
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

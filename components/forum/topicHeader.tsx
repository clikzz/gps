"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight, Lock, LockOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"


type Topic = {
  id: string
  title: string
  isLocked: boolean
  isPinned?: boolean
}

interface TopicHeaderProps {
  topic: Topic
  subforumName: string
  subforumSlug: string
  userRole?: "user" | "moderator" | "admin"
  onTopicUpdate?: (updatedTopic: Topic) => void
}

export function TopicHeader({ topic, subforumName, subforumSlug, userRole = "user", onTopicUpdate }: TopicHeaderProps) {
  const [isLocked, setIsLocked] = useState(topic.isLocked)

  const canModerate = userRole === "moderator" || userRole === "admin"

  const handleToggleLock = () => {
    const newLockedState = !isLocked
    setIsLocked(newLockedState)

    if (onTopicUpdate) {
      onTopicUpdate({ ...topic, isLocked: newLockedState })
    }

    if (newLockedState) {
      toast.success("Tema cerrado", { description: "No se pueden añadir nuevas respuestas." })
    } else {
      toast.success("Tema abierto", { description: "Se pueden añadir nuevas respuestas." })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center text-sm text-muted-foreground">
        <ChevronRight className="h-4 w-4 mx-1" />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight">{topic.title}</h1>
          {isLocked && (
            <Lock className="h-5 w-5 text-muted-foreground" />
          )}
        </div>

        {canModerate && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleToggleLock}>
              {isLocked ? (
                <>
                  <LockOpen className="h-4 w-4 mr-1" />
                  Abrir tema
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4 mr-1" />
                  Cerrar tema
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

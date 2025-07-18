"use client";

import { useState } from "react";
import { Lock, LockOpen, Pin, PinOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useUserProfile } from "@/stores/userProfile"

type Topic = {
  id: number;
  title: string;
  isLocked: boolean;
  isPinned: boolean;
};

interface TopicHeaderProps {
  topic: Topic;
}

export function TopicHeader({ topic }: TopicHeaderProps) {
  const [isLocked, setIsLocked] = useState(topic.isLocked);
  const [isPinned, setIsPinned] = useState(topic.isPinned);
  const currentUserRole = useUserProfile((s) => s.user?.role)
  const canModerate = currentUserRole === "MODERATOR" || currentUserRole === "ADMIN";
  const router = useRouter();

  const toggleLock = async () => {
    try {
      console.log("Toggling lock for topic:", topic.id, "Current state:", isLocked);
      const res = await fetch(
        `/api/forum/topics/${topic.id}/lock`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ locked: !isLocked }),
        }
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Error al togglear lock");
      }
      const { locked } = await res.json();
      setIsLocked(locked);
      toast.success(
        locked ? "Tema cerrado" : "Tema abierto",
        {
          description: locked
            ? "No se aceptan nuevas respuestas"
            : "Puedes responder de nuevo"
        }
      );
      router.refresh();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

    const togglePin = async () => {
    try {
      const res = await fetch(`/api/forum/topics/${topic.id}/feature`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !isPinned }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Error al togglear pin");
      }
      const { featured } = await res.json();
      setIsPinned(featured);
      toast.success(featured ? "Tema destacado" : "Tema des-destacado");
      router.refresh();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isLocked && <Lock className="h-5 w-5 text-muted-foreground" />}
          {isPinned && <Pin className="h-5 w-5 text-muted-foreground" />}
        </div>

        {canModerate && (
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={togglePin}>
              {isPinned ? (
                <>
                  <PinOff className="h-4 w-4 mr-1" />
                  Des-destacar
                </>
              ) : (
                <>
                  <Pin className="h-4 w-4 mr-1" />
                  Destacar
                </>
              )}
            </Button>
            <Button size="sm" variant="outline" onClick={toggleLock}>
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
  );
}

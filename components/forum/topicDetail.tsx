"use client"
import Link from "next/link"
import { formatDateLabel } from "@/lib/date"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { useUserProfile, useSelectedBadges } from "@/stores/userProfile"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"

interface TopicDetailProps {
  topic: {
    id: number
    title: string
    createdAt: string
    subforumId: number
    subforumSlug: string
    author: {
      name: string
      id: string
      tag: number
      menssageCount: number
      avatar_url?: string
    }
    locked: boolean
  }
  mainPost: {
    id: number
    content: string
    createdAt: string
    author: {
      name: string
      id: string
      tag: number
      menssageCount: number
      avatar_url?: string
    }
  } | null
}

const getUserTitle = (messageCount: number): string => {
  if (messageCount >= 150) return "Líder de Manada"
  if (messageCount >= 100) return "Veterinario(a)"
  if (messageCount >= 50) return "Maullador(a) Senior"
  if (messageCount >= 25) return "Amante de Mascotas"
  if (messageCount >= 15) return "Cachorro Activo"
  if (messageCount >= 8) return "Gatito Curioso"
  return "Mascota Nueva"
}

export function TopicDetail({ topic, mainPost }: TopicDetailProps) {
  const currentUserId = useUserProfile((s) => s.user?.id)
  const currentUserRole = useUserProfile((s) => s.user?.role)
  const isAuthor = currentUserId === topic.author.id
  const canEdit = isAuthor || currentUserRole === "MODERATOR" || currentUserRole === "ADMIN"
  const canDelete = isAuthor || currentUserRole === "ADMIN"
  const selectedBadges = useSelectedBadges()
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(mainPost?.content ?? "")
  const [displayContent, setDisplayContent] = useState(mainPost?.content ?? "")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setDisplayContent(mainPost?.content ?? "")
    setEditContent(mainPost?.content ?? "")
  }, [mainPost])

  const handleSaveContent = async () => {
    if (!mainPost) return
    try {
      const res = await fetch(`/api/forum/posts/${mainPost.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editContent }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || "Error al editar el contenido")
      }
      setDisplayContent(editContent)
      setIsEditing(false)
      toast.success("Contenido actualizado")
      router.refresh()
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    setDeleteDialogOpen(false)

    try {
      const res = await fetch(`/api/forum/topics/${topic.id}`, {
        method: "DELETE",
      })
      if (res.status !== 204) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || "Error al eliminar el tema")
      }
      toast.success("Tema eliminado")
      router.push(`/forum/subforum/${topic.subforumSlug}`)
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false)
  }

  if (!mainPost) {
    return (
      <div className="border rounded-lg overflow-hidden w-full p-6 text-center text-muted-foreground">
        <p className="text-lg">Este tema aún no tiene contenido principal.</p>
      </div>
    )
  }

  return (
    <div className="border rounded-lg overflow-hidden relative">
      <div className="border-b p-3 flex justify-end items-center text-sm">
        <div className="flex items-center gap-4">
          <span>{formatDateLabel(topic.createdAt)}</span>
          <span>#{topic.id}</span>
        </div>
      </div>
      <div className="flex">
        <div className="w-48 border-r p-4 text-center space-y-3">
          <div>
            <Link href={`/forum/user/${topic.author.id}`} className="font-medium hover:underline text-sm">
              <span className="text-accent">{topic.author.name}</span>
              <span className="text-gray-400"> #{topic.author.tag}</span>
            </Link>
          </div>
          <div className="text-xs font-semibold text-destructive">{getUserTitle(topic.author.menssageCount)}</div>{" "}
          <div className="flex justify-center">
            {topic.author.avatar_url ? (
              <img
                src={topic.author.avatar_url ?? "/placeholder.svg"}
                alt={`Avatar de ${topic.author.name}`}
                className="w-24 h-24 rounded border"
              />
            ) : (
              <img
                src="/placeholder.svg?height=120&width=120"
                alt={`Avatar de ${topic.author.name}`}
                className="w-24 h-24 rounded border"
              />
            )}
          </div>
          {selectedBadges.length > 0 ? (
            <div className="mt-2 text-sm">
              <div className="flex flex-wrap justify-center gap-1">
                {selectedBadges.map((badge) => (
                  <span 
                    key={badge.id} 
                    className="text-xl" 
                    title={badge.label}
                    >
                    <img 
                    src={badge.icon} 
                    alt={badge.label} 
                    className="inline-block w-6 h-6" 
                    />
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-2 text-sm opacity-50"></div>
          )}
          <div className="text-xs">Mensajes: {topic.author.menssageCount.toLocaleString()}</div>
        </div>
        <div className="flex-1 p-4 min-h-[200px] relative">
          {isEditing ? (
            <div className="space-y-4">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full min-h-[100px] p-3 border rounded-lg resize-none"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSaveContent}>
                  Guardar
                </Button>
                <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="prose max-w-none mb-8">
                <p className="whitespace-pre-wrap">{displayContent}</p>
              </div>
              {(canEdit || canDelete) && (
                <div className="absolute bottom-4 right-4 flex gap-2 text-sm">
                  {canEdit && <button onClick={() => setIsEditing(true)}>Editar</button>}
                  {canEdit && canDelete && <span>|</span>}
                  {canDelete && <button onClick={handleDeleteClick}>Eliminar</button>}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar eliminación del tema</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar este tema y todas sus respuestas? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelDelete}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Eliminar tema
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

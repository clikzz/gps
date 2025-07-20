"use client"
import Link from "next/link"
import { formatDateLabel } from "@/lib/date"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { useState } from "react"
import { useEffect } from "react"
import { useUserProfile, useSelectedBadges } from "@/stores/userProfile"

export interface Reply {
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
}

export interface ReplyListProps {
  replies: Reply[]
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

export function ReplyList({ replies }: ReplyListProps) {
  const [editingReply, setEditingReply] = useState<number | null>(null)
  const [editContent, setEditContent] = useState("")
  const [replyList, setReplyList] = useState(replies)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [replyToDelete, setReplyToDelete] = useState<number | null>(null)
  const itemsPerPage = 7
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(replyList.length / itemsPerPage)
  const currentUserId = useUserProfile((state) => state.user?.id)
  const currentUserRole = useUserProfile((state) => state.user?.role)
  const selectedBadges = useSelectedBadges()

  useEffect(() => {
    setReplyList(replies)
    setCurrentPage(1)
  }, [replies])

  const paginatedReplies = replyList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const onPageChange = (page: number) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
  }

  const handleEdit = (reply: Reply) => {
    setEditingReply(reply.id)
    setEditContent(reply.content)
  }

  const handleSaveEdit = async (replyId: number) => {
    setReplyList(replyList.map((reply) => (reply.id === replyId ? { ...reply, content: editContent } : reply)))
    setEditingReply(null)
    try {
      const res = await fetch(`/api/forum/posts/${replyId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: editContent }),
      })
      if (!res.ok) {
        throw new Error("Error al editar la respuesta")
      }
      setReplyList(replyList.map((r) => (r.id === replyId ? { ...r, content: editContent } : r)))
      toast.success("Respuesta editada correctamente")
      setEditingReply(null)
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  const handleDeleteClick = (replyId: number) => {
    setReplyToDelete(replyId)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!replyToDelete) return

    setReplyList(replyList.filter((reply) => reply.id !== replyToDelete))
    toast.success("Respuesta eliminada correctamente")
    setDeleteDialogOpen(false)
    setReplyToDelete(null)

    try {
      const res = await fetch(`/api/forum/posts/${replyToDelete}`, {
        method: "DELETE",
      })
      if (res.status !== 204) {
        const { error } = await res.json().catch(() => ({}))
        throw new Error(error || "Error al eliminar")
      }
      setReplyList(replyList.filter((r) => r.id !== replyToDelete))
      toast.success("Respuesta eliminada correctamente")
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false)
    setReplyToDelete(null)
  }

  if (replies.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg text-muted-foreground">
        <p className="text-lg">No hay respuestas todavía.</p>
        <p className="mt-2">¡Sé el primero en responder!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {paginatedReplies.map((reply) => {
        const isAuthor = currentUserId === reply.author.id
        const isEditing = editingReply === reply.id
        const canEdit = isAuthor || currentUserRole === "MODERATOR" || currentUserRole === "ADMIN"
        const canDelete = isAuthor || currentUserRole === "ADMIN"
        console.log("reply id:", reply.id, "isAuthor:", isAuthor, "canEdit:", canEdit, "canDelete:", canDelete)

        return (
          <div key={reply.id} className="border rounded-lg overflow-hidden">
            <div className="border-b p-3 flex justify-end items-center text-sm">
              <div className="flex items-center gap-4">
                <span>{formatDateLabel(reply.createdAt)}</span>
                <span>#{reply.id}</span>
              </div>
            </div>
            <div className="flex">
              <div className="w-48 border-r p-4 text-center space-y-3">
                <div>
                  <Link href={`/forum/user/${reply.author.id}`} className="font-medium hover:underline text-sm">
                    <span className="text-accent">{reply.author.name}</span>
                    <span className="text-gray-400"> #{reply.author.tag}</span>
                  </Link>
                </div>
                <div className="text-xs font-semibold text-destructive">{getUserTitle(reply.author.menssageCount)}</div>{" "}
                <div className="flex justify-center">
                  {reply.author.avatar_url ? (
                    <img
                      src={reply.author.avatar_url ?? "/placeholder.svg"}
                      alt={`Avatar de ${reply.author.name}`}
                      className="w-24 h-24 rounded border"
                    />
                  ) : (
                    <img
                      src="/placeholder.svg?height=120&width=120"
                      alt={`Avatar de ${reply.author.name}`}
                      className="w-24 h-24 rounded border"
                    />
                  )}
                </div>
                {selectedBadges.length > 0 ? (
                  <div className="flex flex-wrap justify-center gap-1">
                    {selectedBadges.map((badge) => (
                      <div key={badge.id} className="text-center">
                        <img
                          src={badge.icon}
                          alt={badge.label}
                          className="inline-block w-6 h-6"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-2 text-sm opacity-50"></div>
                )}
                <div className="text-xs">Mensajes: {reply.author.menssageCount.toLocaleString()}</div>
              </div>
              <div className="flex-1 p-4 min-h-[150px] relative">
                {isEditing ? (
                  <div className="space-y-4">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full min-h-[100px] p-3 border rounded-lg resize-none"
                      placeholder="Edita tu mensaje..."
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleSaveEdit(reply.id)}>
                        Guardar
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingReply(null)}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="prose max-w-none mb-8">
                      <p className="whitespace-pre-wrap">{reply.content}</p>
                    </div>
                    {(isAuthor || canEdit || canDelete) && (
                      <div className="absolute bottom-4 right-4 flex gap-2 text-sm">
                        {canEdit && <button onClick={() => handleEdit(reply)}>Editar</button>}
                        {canEdit && canDelete && <span>|</span>}
                        {canDelete && <button onClick={() => handleDeleteClick(reply.id)}>Eliminar</button>}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )
      })}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar esta respuesta? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelDelete}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Button
              key={p}
              size="sm"
              variant={p === currentPage ? "default" : "outline"}
              onClick={() => onPageChange(p)}
            >
              {p}
            </Button>
          ))}
          <Button
            size="sm"
            variant="outline"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </Button>
        </div>
      )}
      {totalPages > 1 && (
        <div className="text-center text-sm text-muted-foreground">{replyList.length} Respuestas en total</div>
      )}
    </div>
  )
}

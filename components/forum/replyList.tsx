"use client"

import Link from "next/link"
import { formatDateLabel } from "@/lib/date"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useState } from "react"
import { useEffect } from "react"
import { useUserProfile } from "@/stores/userProfile"

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
  if (messageCount >= 10) return "Cachorro Activo"
  if (messageCount >= 5) return "Gatito Curioso"
  return "Mascota Nueva"
}

export function ReplyList({ replies }: ReplyListProps) {

  const [editingReply, setEditingReply] = useState<number | null>(null)
  const [editContent, setEditContent] = useState("")
  const [replyList, setReplyList] = useState(replies)

  const currentUserId = useUserProfile((state) => state.user?.id)
  const currentUserRole = useUserProfile((state) => state.user?.role)

  useEffect(() => {
    setReplyList(replies)
  }, [replies])


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
      setReplyList(replyList.map((r) =>
        r.id === replyId ? { ...r, content: editContent } : r
      ))
      toast.success("Respuesta editada correctamente")
      setEditingReply(null)
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  const handleDelete = async (replyId: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta respuesta?")) {
      setReplyList(replyList.filter((reply) => reply.id !== replyId))
      toast.success("Respuesta eliminada correctamente")
      try {
        const res = await fetch(`/api/forum/posts/${replyId}`, {
          method: "DELETE",
        })
        if (res.status !== 204) {
          const { error } = await res.json().catch(() => ({}))
          throw new Error(error || "Error al eliminar")
        }

        setReplyList(replyList.filter((r) => r.id !== replyId))
        toast.success("Respuesta eliminada correctamente")
      } catch (err: any) {
        toast.error(err.message)
      }
    }
  }

  if (replies.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg text-muted-foreground">
        <p className="text-lg">No hay respuestas todavía.</p>
        <p className="mt-2">¡Sé el primero en responder!</p>
      </div>
    )
  }

  console.log("currentUserId:", currentUserId)

  return (
    <div className="space-y-4">
      {replyList.map((reply) => {

        const isAuthor = currentUserId === reply.author.id
        const isEditing = editingReply === reply.id
        const canEdit = isAuthor || currentUserRole === "MODERATOR" || currentUserRole === "ADMIN"
        const canDelete = isAuthor || currentUserRole === "ADMIN"


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
                    {reply.author.name} #{reply.author.tag}
                  </Link>
                </div>

                <div className="text-xs font-medium">{getUserTitle(reply.author.menssageCount)}</div>

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


                    {isAuthor && (
                      <div className="absolute bottom-4 right-4 flex gap-1 text-sm">
                        {canEdit && (
                          <button onClick={() => handleEdit(reply)}>Editar</button>
                        )}
                        <span> | </span>
                        {canDelete && (
                          <button onClick={() => handleDelete(reply.id)}>Eliminar</button>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

"use client"

import Link from "next/link"
import { formatDateLabel } from "@/lib/date"
import { Button } from "@/components/ui/button"
import type { Reply, Badge } from "@/types/forum"
import { useState, useEffect } from "react"

interface ReplyItemProps {
  reply: Reply
  isAuthor: boolean
  isEditing: boolean
  canEdit: boolean
  canDelete: boolean
  editContent: string
  selectedBadges: any[]
  getUserTitle: (messageCount: number) => string
  onEdit: (reply: Reply) => void
  onDeleteClick: (replyId: number) => void
  onSaveEdit: (replyId: number) => void
  onCancelEdit: () => void
  onEditContentChange: (content: string) => void
}

export function ReplyItem({
  reply,
  isAuthor,
  isEditing,
  canEdit,
  canDelete,
  editContent,
  selectedBadges,
  getUserTitle,
  onEdit,
  onDeleteClick,
  onSaveEdit,
  onCancelEdit,
  onEditContentChange,
}: ReplyItemProps) {
  console.log("reply id:", reply.id, "isAuthor:", isAuthor, "canEdit:", canEdit, "canDelete:", canDelete)

  const [badges, setBadges] = useState<Badge[]>([])

  useEffect(() => {
    fetch(`/api/forum/users/${reply.author.id}/badges`, { credentials: "include" })
      .then(r => r.ok ? r.json() : [])
      .then(setBadges)
      .catch(console.error)
  }, [reply.author.id])

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="border-b p-3 flex justify-end bg-accent text-white items-center text-sm">
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
                className="w-32 h-32 rounded border"
              />
            ) : (
              <img
                src="/placeholder.svg?height=120&width=120"
                className="w-32 h-32 rounded border"
              />
            )}
          </div>
          {badges.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-1">
              {badges.map((badge) => (
                <div key={badge.id} className="text-center">
                  <img
                    src={badge.icon || "/placeholder.svg"}
                    alt={badge.label}
                    className="inline-block w-9 h-9"
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
                onChange={(e) => onEditContentChange(e.target.value)}
                className="w-full min-h-[100px] p-3 border rounded-lg resize-none"
                placeholder="Edita tu mensaje..."
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={() => onSaveEdit(reply.id)}>
                  Guardar
                </Button>
                <Button size="sm" variant="outline" onClick={onCancelEdit}>
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
                  {canEdit && <button onClick={() => onEdit(reply)}>Editar</button>}
                  {canEdit && canDelete && <span>|</span>}
                  {canDelete && <button onClick={() => onDeleteClick(reply.id)}>Eliminar</button>}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

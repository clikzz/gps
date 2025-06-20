import Link from "next/link"
import { formatDateLabel } from "@/lib/date"

interface Reply {
  id: number
  content: string
  createdAt: string
  author: {
    name: string
    id: string
    tag: number
    menssageCount: number
  }
}

interface ReplyListProps {
  replies: Reply[]
}

export function ReplyList({ replies }: ReplyListProps) {
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
      {replies.map((reply) => (
        <div key={reply.id} className="border rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 p-6 gap-6">
            <div className="lg:col-span-3 xl:col-span-2 lg:border-r lg:pr-6">
              <div className="text-center lg:text-left">
                <Link href={`/forum/user/${reply.author.id}`} className="font-medium hover:underline text-base">
                  {reply.author.name}#{reply.author.tag}
                </Link>
                <div className="text-sm text-muted-foreground mt-1">
                  Mensajes: {reply.author.menssageCount}
                  </div>
              </div>
            </div>

            <div className="lg:col-span-9 xl:col-span-10">
              <div className="text-sm text-muted-foreground mb-4">
                {formatDateLabel(reply.createdAt)}
                </div>
              <div className="prose max-w-none text-base leading-relaxed">
                <p className="whitespace-pre-wrap">{reply.content}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

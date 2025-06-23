import Link from "next/link"
import { formatDateLabel } from "@/lib/date"

interface TopicDetailProps {
  topic: {
    id: number
    title: string
    createdAt: string
    author: {
      name: string
      id: string
      tag: number
      menssageCount: number
      avatar_url: string
    }
  }
  mainPost: {
    content: string
    createdAt: string
    author: {
      name: string
      id: string
      tag: number
      menssageCount: number
      avatar_url: string
    }
  } | null
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

export function TopicDetail({ topic, mainPost }: TopicDetailProps) {
  if (!mainPost) {
    return (
      <div className="border rounded-lg overflow-hidden w-full p-6 text-center text-muted-foreground">
        <p className="text-lg">Este tema aún no tiene contenido principal.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
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
              {topic.author.name} #{topic.author.tag}
            </Link>
          </div>

          <div className="text-xs font-medium">{getUserTitle(topic.author.menssageCount)}</div>

          <div className="flex justify-center">
            {topic.author.avatar_url ? (
              <img
                src={topic.author.avatar_url}
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


          <div className="text-xs">Mensajes: {topic.author.menssageCount.toLocaleString()}</div>
        </div>

        <div className="flex-1 p-4 min-h-[200px] relative">
          <>
            <div className="prose max-w-none mb-8">
              <p>{mainPost.content}</p>
            </div>
          </>
        </div>
      </div>
    </div>
  )
}

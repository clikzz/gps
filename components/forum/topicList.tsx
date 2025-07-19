import Link from "next/link"
import { formatDateLabel } from "@/lib/date"
import { Lock, Pin, BookOpen } from "lucide-react"
import type { ForumTopic } from "@/types/forum"

interface TopicListProps {
  topics: ForumTopic[]
  subforumSlug: string
  subforumId?: number
}

export function TopicList({ topics, subforumSlug }: TopicListProps) {
  const rulesTopic = {
    id: "rules",
    title: "Reglas del Foro - ¡LÉEME PRIMERO!",
    author: {
      name: "Administración",
      id: "system",
      tag: 999,
    },
    postsCount: 1,
    updatedAt: "2025-07-17T12:00:00Z",
    featured: true,
    locked: false,
  }

  if (topics.length === 0) {
    return (
      <div className="space-y-4">
        <div className="border rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 p-4 gap-4 hover:bg-muted/30 transition-colors bg-muted/50">
            <div className="lg:col-span-7 xl:col-span-8 space-y-1">
              <Link
                href={`/forum/subforum/${subforumSlug}/topic/rules`}
                className="flex items-center font-medium hover:underline text-base space-x-2"
              >
                <Pin className="w-5 h-5 text-muted-foreground" />
                <BookOpen className="w-5 h-5 text-muted-foreground" />
                <span className="text-foreground">{rulesTopic.title}</span>
              </Link>
              <div className="text-sm text-muted-foreground flex items-center space-x-2">
                <span>
                  por {rulesTopic.author.name}#{rulesTopic.author.tag}
                </span>
              </div>
            </div>
            <div className="flex lg:block lg:col-span-2 xl:col-span-1 text-center">
              <div className="text-sm text-muted-foreground">Mensajes</div>
              <div className="font-medium">{rulesTopic.postsCount}</div>
            </div>
            <div className="lg:col-span-3 xl:col-span-3 flex flex-col items-end justify-center text-sm">
              <div className="text-muted-foreground">{formatDateLabel(rulesTopic.updatedAt)}</div>
              <div>
                por{" "}
                <span className="font-medium">
                  {rulesTopic.author.name}#{rulesTopic.author.tag}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-8 text-center text-muted-foreground">
          <p className="text-lg">No hay temas en este subforo todavía.</p>
          <p className="mt-2">¡Sé el primero en crear un tema!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 p-4 gap-4 hover:bg-muted/30 transition-colors bg-muted/50">
        <div className="lg:col-span-7 xl:col-span-8 space-y-1">
          <Link
            href={`/forum/subforum/${subforumSlug}/topic/rules`}
            className="flex items-center font-medium hover:underline text-base space-x-2"
          >
            <Pin className="w-5 h-5 text-muted-foreground" />
            <BookOpen className="w-5 h-5 text-muted-foreground" />
            <span className="text-foreground">{rulesTopic.title}</span>
          </Link>
          <div className="text-sm text-muted-foreground flex items-center space-x-2">
            <span>
              por <span className="text-accent font-medium">{rulesTopic.author.name}</span> <span className="text-gray-400 font-medium">#{rulesTopic.author.tag}</span>
            </span>
          </div>
        </div>
        <div className="flex lg:block lg:col-span-2 xl:col-span-1 text-center">
          <div className="text-sm text-muted-foreground">Mensajes</div>
          <div className="font-medium">{rulesTopic.postsCount}</div>
        </div>
        <div className="lg:col-span-3 xl:col-span-3 flex flex-col items-end justify-center text-sm">
          <div className="text-muted-foreground">{formatDateLabel(rulesTopic.updatedAt)}</div>
          <div>
            <span className="font-medium">
              <span className="text-accent">{rulesTopic.author.name}</span> <span className="text-gray-400">#{rulesTopic.author.tag}</span>
            </span>
          </div>
        </div>
      </div>

      {topics.map((topic, idx) => {
        const pagesCount = Math.ceil(topic.postsCount / 8)
        return (
          <div key={topic.id} className="border-t">
            <div className="grid grid-cols-1 lg:grid-cols-12 p-4 gap-4 hover:bg-muted/30 transition-colors">
              <div className="lg:col-span-7 xl:col-span-8 space-y-1">
                <Link
                  href={`/forum/subforum/${subforumSlug}/topic/${topic.id}`}
                  className="flex items-center font-medium hover:underline text-base space-x-2"
                >
                  {topic.featured && <Pin className="w-5 h-5 text-muted-foreground" />}
                  {topic.locked && <Lock className="w-5 h-5 text-muted-foreground" />}
                  <span>{topic.title}</span>
                </Link>
                <div className="text-sm text-muted-foreground flex items-center space-x-2">
                  <span>
                    por <span className="text-accent font-medium">{topic.author.name}</span> <span className="text-gray-400 font-medium">#{topic.author.tag}</span>
                  </span>
                  {pagesCount > 1 && (
                    <div className="flex space-x-1">
                      {Array.from({ length: pagesCount }, (_, i) => (
                        <Link key={i + 1} href={`/forum/subforum/${subforumSlug}/topic/${topic.id}?page=${i + 1}`}>
                          [{i + 1}]
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex lg:block lg:col-span-2 xl:col-span-1 text-center">
                <div className="text-sm text-muted-foreground">Mensajes</div>
                <div className="font-medium">{topic.postsCount}</div>
              </div>
              <div className="lg:col-span-3 xl:col-span-3 flex flex-col items-end justify-center text-sm">
                <div className="text-muted-foreground">{formatDateLabel(topic.updatedAt)}</div>
                <div>
                  por{" "}
                  <Link href={`/forum/user/${topic.author.id}`} className="hover:underline">
                    <span className="text-accent font-medium">{topic.author.name}</span> <span className="text-gray-400 font-medium">#{topic.author.tag}</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

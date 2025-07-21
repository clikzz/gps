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

  const TopicRow = ({ topic, isRules = false }: { topic: any; isRules?: boolean }) => {
  const pagesCount = Math.ceil(topic.postsCount / 8)

    return (
      <div className={`${!isRules ? "border-t" : ""}`}>
        <div className="p-3 sm:p-4 hover:bg-muted/30 transition-colors">
          <div className="block lg:hidden space-y-3">
            <div>
              <Link
                href={`/forum/subforum/${subforumSlug}/topic/${topic.id}`}
                className="flex items-start font-medium hover:underline text-base space-x-2 leading-tight"
              >
                <div className="flex items-center space-x-1 flex-shrink-0 mt-0.5">
                  {topic.featured && <Pin className="w-4 h-4 text-muted-foreground" />}
                  {topic.locked && <Lock className="w-4 h-4 text-muted-foreground" />}
                  {isRules && <BookOpen className="w-4 h-4 text-muted-foreground" />}
                </div>
                <span className="break-words">{topic.title}</span>
              </Link>

              <div className="text-sm text-muted-foreground mt-2 space-y-1">
                <div>
                  <span>por </span>
                  <Link href={`/forum/user/${topic.author.id}`} className="hover:underline">
                    <span className="text-accent font-medium">{topic.author.name}</span>
                    <span className="text-gray-400 font-medium ml-1">#{topic.author.tag}</span>
                  </Link>
                </div>

                {pagesCount > 1 && (
                  <div className="flex flex-wrap gap-1 text-xs">
                    <span className="text-muted-foreground">Páginas:</span>
                    {Array.from({ length: Math.min(pagesCount, 5) }, (_, i) => (
                      <Link
                        key={i + 1}
                        href={`/forum/subforum/${subforumSlug}/topic/${topic.id}?page=${i + 1}`}
                        className="text-accent hover:underline"
                      >
                        [{i + 1}]
                      </Link>
                    ))}
                    {pagesCount > 5 && <span className="text-muted-foreground">...</span>}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">Mensajes</div>
                  <div className="font-medium">{topic.postsCount}</div>
                </div>
              </div>

              <div className="text-right text-xs">
                <div className="text-muted-foreground">{formatDateLabel(topic.updatedAt)}</div>
                <div className="mt-1">
                  <span className="text-muted-foreground">por </span>
                  <Link href={`/forum/user/${topic.author.id}`} className="hover:underline">
                    <span className="text-accent font-medium">{topic.author.name}</span>
                    <span className="text-gray-400 font-medium ml-1">#{topic.author.tag}</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden lg:grid lg:grid-cols-12 gap-4 items-center">
            <div className="col-span-7 xl:col-span-8 space-y-1">
              <Link
                href={`/forum/subforum/${subforumSlug}/topic/${topic.id}`}
                className="flex items-center font-medium hover:underline text-base space-x-2"
              >
                {topic.featured && <Pin className="w-5 h-5 text-muted-foreground" />}
                {topic.locked && <Lock className="w-5 h-5 text-muted-foreground" />}
                {isRules && <BookOpen className="w-5 h-5 text-muted-foreground" />}
                <span>{topic.title}</span>
              </Link>

              <div className="text-sm text-muted-foreground flex items-center space-x-2">
                <span>
                  por{" "}
                  <Link href={`/forum/user/${topic.author.id}`} className="hover:underline">
                    <span className="text-accent font-medium">{topic.author.name}</span>
                    <span className="text-gray-400 font-medium ml-1">#{topic.author.tag}</span>
                  </Link>
                </span>

                {pagesCount > 1 && (
                  <div className="flex space-x-1">
                    {Array.from({ length: Math.min(pagesCount, 10) }, (_, i) => (
                      <Link
                        key={i + 1}
                        href={`/forum/subforum/${subforumSlug}/topic/${topic.id}?page=${i + 1}`}
                        className="text-accent hover:underline"
                      >
                        [{i + 1}]
                      </Link>
                    ))}
                    {pagesCount > 10 && <span className="text-muted-foreground">...</span>}
                  </div>
                )}
              </div>
            </div>

            <div className="col-span-2 xl:col-span-1 text-center">
              <div className="text-sm text-muted-foreground">Mensajes</div>
              <div className="font-medium">{topic.postsCount}</div>
            </div>

            <div className="col-span-3 xl:col-span-3 flex flex-col items-end justify-center text-sm">
              <div className="text-muted-foreground">{formatDateLabel(topic.updatedAt)}</div>
              <div>
                <span className="text-muted-foreground">por </span>
                <Link href={`/forum/user/${topic.author.id}`} className="hover:underline">
                  <span className="text-accent font-medium">{topic.author.name}</span>
                  <span className="text-gray-400 font-medium ml-1">#{topic.author.tag}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (topics.length === 0) {
    return (
      <div className="space-y-4">
        <div className="border rounded-lg overflow-hidden">
          <div className={`p-3 sm:p-4 hover:bg-muted/30 transition-colors bg-muted/50`}>
            <TopicRow topic={rulesTopic} isRules={true} />
          </div>
        </div>
        <div className="border rounded-lg p-6 sm:p-8 text-center text-muted-foreground">
          <p className="text-base sm:text-lg">No hay temas en este subforo todavía.</p>
          <p className="mt-2 text-sm sm:text-base">¡Sé el primero en crear un tema!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-muted/50">
        <TopicRow topic={rulesTopic} isRules={true} />
      </div>
      {topics.map((topic) => (
        <TopicRow key={topic.id} topic={topic} />
      ))}
    </div>
  )
}

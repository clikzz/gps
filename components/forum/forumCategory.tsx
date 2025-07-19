import Link from "next/link"
import { formatDateLabel } from "@/lib/date"

export interface ForumCategoryProps {
  category: {
    id: string
    name: string
    subforums: Array<{
      id: number
      name: string
      slug: string
      description: string
      topicCount: number
      messageCount: number
      lastPost: any
    }>
  }
}

export function ForumCategory({ category }: ForumCategoryProps) {
  return (
    <div className="space-y-1">
      <div className="border rounded-t-lg p-4 font-medium text-lg bg-muted/50">{category.name}</div>

      <div className="border rounded-b-lg overflow-hidden">
        {category.subforums.map((subforum, index) => (
          <div
            key={`${category.id}-${subforum.slug}`}
            className={`${index !== 0 ? "border-t" : ""}`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 p-4 gap-4 hover:bg-muted/30 transition-colors">
              <div className="lg:col-span-7 xl:col-span-8">
                <Link href={`/forum/subforum/${subforum.slug}`} className="font-medium hover:underline text-base">
                  {subforum.name}
                </Link>
                {subforum.description && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{subforum.description}</p>
                )}
              </div>

              <div className="flex lg:block lg:col-span-2 xl:col-span-1 gap-4 lg:gap-0">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Temas</div>
                  <div className="font-medium">{subforum.topicCount}</div>
                </div>
              </div>

              <div className="flex lg:block lg:col-span-2 xl:col-span-1 gap-4 lg:gap-0">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Mensajes</div>
                  <div className="font-medium">{subforum.messageCount}</div>
                </div>
              </div>

              <div className="lg:col-span-1 xl:col-span-2 text-sm lg:text-right">
                <div>
                  {subforum.lastPost ? (
                    <>
                      <div className="text-muted-foreground">
                        {formatDateLabel(subforum.lastPost.date)}
                        </div>
                      <div>
                        por <span className="text-accent font-medium">{subforum.lastPost.author.name}</span> <span className="text-gray-400 font-medium">#{subforum.lastPost.author.tag}</span>
                        <Link href={`/forum/user/${subforum.lastPost.author.id}`} className="hover:underline">
                        </Link>
                      </div>
                    </>
                  ) : (
                    <span className="text-muted-foreground">Sin actividad</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

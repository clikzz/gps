import Link from "next/link"
import { formatDateLabel } from "@/lib/date"
import { Topic, TopicListProps } from "@/types/forum";

export function TopicList({ topics, subforumSlug, subforumId }: TopicListProps) {
  if (topics.length === 0) {
    return (
      <div className="border rounded-lg p-8 text-center text-muted-foreground">
        <p className="text-lg">No hay temas en este subforo todavía.</p>
        <p className="mt-2">¡Sé el primero en crear un tema!</p>
      </div>
    )
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      {topics.map((topic, index) => (
        <div key={topic.id} className={`${index !== 0 ? "border-t" : ""}`}>
          <div className="grid grid-cols-1 lg:grid-cols-12 p-4 gap-4 hover:bg-muted/30 transition-colors">
            <div className="lg:col-span-7 xl:col-span-8">
              <Link href={`/forum/topic/${topic.id}`} className="font-medium hover:underline text-base">
                {topic.title}
              </Link>
              <div className="text-sm text-muted-foreground mt-1">
              </div>
            </div>

            <div className="flex lg:block lg:col-span-2 xl:col-span-1 gap-4 lg:gap-0">
              <div className="text-center">
              </div>
            </div>

            <div className="flex lg:block lg:col-span-2 xl:col-span-1 gap-4 lg:gap-0">
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Mensajes</div>
                <div className="font-medium">{topic.postsCount}</div>
              </div>
            </div>

            <div className="lg:col-span-1 xl:col-span-2 text-sm lg:text-right">
              <div className="text-muted-foreground">
                {formatDateLabel(topic.updatedAt)}
                </div>
              <div>
                por {topic.author.name}#{topic.author.tag} 
                <Link href={`/forum/user/${topic.author.id}`} className="hover:underline">
                  {topic.author.name}
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

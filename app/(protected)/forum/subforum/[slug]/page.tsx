import Link from "next/link"
import { TopicList } from "@/components/forum/topicList"
import { fetcher } from "@/lib/utils"
import { notFound } from "next/navigation"

interface Topic {
  id: number
  title: string
  createdAt: string
  updatedAt: string
  author: {
    name: string
    id: string
  }
  postsCount: number
}

interface Subforum {
  id: number
  name: string
  description: string
  category: string
}

const subforumMap: Record<string, string> = {
  "cuidados-salud": "Cuidados y Salud",
  "razas-caracteristicas": "Razas y Características",
  ayuda: "Ayuda",
  faq: "Preguntas frecuentes",
  "anuncios-tecnicos": "Anuncios Técnicos",
  presentaciones: "Presentaciones",
  cafeteria: "La cafetería",
}

async function getSubforums(): Promise<Subforum[]> {
  try {
    return await fetcher<Subforum[]>("/api/forum/subforums")
  } catch (error) {
    return []
  }
}

async function getTopics(subforumId: number): Promise<Topic[]> {
  try {
    return await fetcher<Topic[]>(`/api/forum/topics?subforumId=${subforumId}`)
  } catch (error) {
    return []
  }
}

interface SubforumPageProps {
  params: {
    slug: string
  }
}

export default async function SubforumPage({ params }: SubforumPageProps) {
  const subforumName = subforumMap[params.slug]
  if (!subforumName) {
    notFound()
  }

  const subforums = await getSubforums()
  const subforum = subforums.find((s) => s.name.toLowerCase().includes(subforumName.toLowerCase().split(" ")[0]))

  const topics = subforum ? await getTopics(subforum.id) : []

  return (
    <div className="min-h-screen w-full">
      <main className="w-full max-w-7xl mx-auto p-4 lg:p-6 space-y-6">
        <div className="text-sm breadcrumbs">
          <Link href="/forum" className="hover:underline">
            Inicio
          </Link>
          {" > "}
          <span>{subforumName}</span>
        </div>

        <div className="border rounded-lg p-4 font-medium text-lg">{subforumName}</div>

        <TopicList topics={topics} subforumSlug={params.slug} subforumId={subforum?.id} />

        <div className="flex justify-end">
          <Link
            href={`/forum/subforum/${params.slug}/new-topic`}
            className="border rounded-full py-2 px-4 text-sm hover:bg-accent transition-colors"
          >
            Nuevo tema
          </Link>
        </div>
      </main>
    </div>
  )
}

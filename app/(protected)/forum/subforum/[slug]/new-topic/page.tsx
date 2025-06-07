import Link from "next/link"
import { NewTopicForm } from "@/components/forum/newTopicForm"
import { fetcher } from "@/lib/utils"
import { notFound } from "next/navigation"

const subforumMap: Record<string, string> = {
  "cuidados-salud": "Cuidados y Salud",
  "razas-caracteristicas": "Razas y Características",
  ayuda: "Ayuda",
  faq: "Preguntas frecuentes",
  "anuncios-tecnicos": "Anuncios Técnicos",
  presentaciones: "Presentaciones",
  cafeteria: "La cafetería",
}

interface Subforum {
  id: number
  name: string
  description: string
  category: string
}

async function getSubforums(): Promise<Subforum[]> {
  try {
    return await fetcher<Subforum[]>("/api/forum/subforums")
  } catch (error) {
    return []
  }
}

interface NewTopicPageProps {
  params: {
    slug: string
  }
}

export default async function NewTopicPage({ params }: NewTopicPageProps) {
  const subforumName = subforumMap[params.slug]
  if (!subforumName) {
    notFound()
  }

  const subforums = await getSubforums()
  const subforum = subforums.find((s) => s.name.toLowerCase().includes(subforumName.toLowerCase().split(" ")[0]))

  if (!subforum) {
    notFound()
  }

  return (
    <div className="min-h-screen w-full">
      <main className="w-full max-w-4xl mx-auto p-4 lg:p-6 space-y-6">
        <div className="text-sm breadcrumbs">
          <Link href="/forum" className="hover:underline">
            Inicio
          </Link>
          {" > "}
          <Link href={`/forum/subforum/${params.slug}`} className="hover:underline">
            {subforumName}
          </Link>
          {" > "}
          <span>Nuevo tema</span>
        </div>

        <div className="border rounded-lg p-6">
          <h1 className="text-2xl font-medium mb-6">Crear nuevo tema en {subforumName}</h1>
          <NewTopicForm subforumSlug={params.slug} subforumId={subforum.id} />
        </div>
      </main>
    </div>
  )
}

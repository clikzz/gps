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
    return await fetcher<Subforum[]>(`/api/forum/subforums`)
  } catch (error) {
    console.error("Error fetching subforums:", error)
    return []
  }
}

export default async function NewTopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const subforumName = subforumMap[slug];
  if (!subforumName) notFound();

  const subforums = await getSubforums()
  const found = subforums.find((s) =>
    s.name.toLowerCase().includes(subforumName.toLowerCase().split(" ")[0])
  );

  const subforum = found ?? {
    id: 1,
    name: subforumName,
    description: "",
    category: "",
  }

  return (
    <div className="min-h-screen w-full">
      <main className="w-full max-w-4xl mx-auto p-4 lg:p-6 space-y-6">
        <div className="text-sm breadcrumbs">
          <Link href="/forum" className="hover:underline">
            Inicio
          </Link>
          {" > "}
          <Link href={`/forum/subforum/${slug}`} className="hover:underline">
            {subforumName}
          </Link>
          {" > "}
          <span>Nuevo tema</span>
        </div>

        <div className="border rounded-lg p-6">
          <h1 className="text-2xl font-medium mb-6">
            Crear nuevo tema en {subforumName}
          </h1>
          <NewTopicForm subforumSlug={slug} subforumId={subforum.id} />
        </div>
      </main>
    </div>
  );
}
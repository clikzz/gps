import { ForumCategory } from "@/components/forum/forumCategory"
import { fetcher } from "@/lib/utils"

interface Subforum {
  id: number
  name: string
  description: string
  category: string
}

const defaultCategories = [
  {
    id: "1",
    name: "Cuidado de Mascotas",
    subforums: [
      {
        name: "Cuidados y Salud",
        description: "Consejos sobre cuidados, salud y bienestar de nuestras mascotas.",
        slug: "cuidados-salud",
      },
      {
        name: "Razas y Características",
        description: "Información sobre diferentes razas de mascotas y sus características.",
        slug: "razas-caracteristicas",
      },
      {
        name: "Ayuda",
        description: "Espacio para solicitar ayuda con problemas específicos de tus mascotas.",
        slug: "ayuda",
      },
    ],
  },
  {
    id: "2",
    name: "Asistencia / Informaciones",
    subforums: [
      {
        name: "Preguntas frecuentes",
        description: "Permite a los usuarios hacer preguntas y tener respuestas a través de mods.",
        slug: "faq",
      },
      {
        name: "Anuncios Técnicos",
        description: "",
        slug: "anuncios-tecnicos",
      },
    ],
  },
  {
    id: "3",
    name: "Comunidad",
    subforums: [
      {
        name: "Presentaciones",
        description: "Aqui los duenos se pueden hacer una presentacion de sus mascotas para conocerse",
        slug: "presentaciones",
      },
      {
        name: "La cafetería",
        description: "Conversaciones sobre otros temas que no sean del foro.",
        slug: "cafeteria",
      },
    ],
  },
]

async function getSubforums(): Promise<Subforum[]> {
  try {
    return await fetcher<Subforum[]>("/api/forum/subforums")
  } catch (error) {
    console.error("Error fetching subforums:", error)
    return []
  }
}

async function getTopicsCount(subforumId: number) {
  try {
    const topics = await fetcher<any[]>(`/api/forum/topics?subforumId=${subforumId}`)
    return topics.length
  } catch (error) {
    return 0
  }
}

export default async function ForumPage() {
  const subforums = await getSubforums()

  const categoriesWithData = await Promise.all(
    defaultCategories.map(async (category) => {
      const categorySubforums = await Promise.all(
        category.subforums.map(async (defaultSub) => {
          const dbSubforum = subforums.find(
            (s) =>
              s.name.toLowerCase().includes(defaultSub.name.toLowerCase().split(" ")[0]) ||
              s.category === category.name,
          )

          const topicsCount = dbSubforum ? await getTopicsCount(dbSubforum.id) : 0

          return {
            id: dbSubforum?.id || 0,
            name: defaultSub.name,
            slug: defaultSub.slug,
            description: defaultSub.description,
            topicCount: topicsCount,
            messageCount: 0, 
            lastPost: null,
          }
        }),
      )

      return {
        ...category,
        subforums: categorySubforums,
      }
    }),
  )

  return (
    <div className="min-h-screen w-full">
      <main className="w-full max-w-7xl mx-auto p-4 lg:p-6 space-y-6">
        {categoriesWithData.map((category) => (
          <ForumCategory key={category.id} category={category} />
        ))}
      </main>
    </div>
  )
}

import Link from "next/link"

interface TopicDetailProps {
  topic: {
    id: number
    title: string
    createdAt: string
    author: {
      name: string
      id: string
      menssageCount: number
    }
  }
  mainPost: {
    content: string
    createdAt: string
    author: {
      name: string
      id: string
      menssageCount: number
    }
  } | null
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
    <div className="border rounded-lg overflow-hidden w-full">
      <div className="border-b p-4 font-medium text-lg bg-muted/50 w-full">{topic.title}</div>

      <div className="grid grid-cols-1 lg:grid-cols-12 p-6 gap-6 w-full">
        <div className="lg:col-span-3 xl:col-span-2 lg:border-r lg:pr-6">
          <div className="text-center lg:text-left">
            <Link href={`/forum/user/${mainPost.author.id}`} className="font-medium hover:underline text-base">
              {mainPost.author.name}
            </Link>
            <div className="text-sm text-muted-foreground mt-1">Mensajes: {mainPost.author.menssageCount}</div>
          </div>
        </div>

        <div className="lg:col-span-9 xl:col-span-10">
          <div className="text-sm text-muted-foreground mb-4">{new Date(mainPost.createdAt).toLocaleString()}</div>
          <div className="prose max-w-none text-base leading-relaxed">
            <p className="whitespace-pre-wrap">{mainPost.content}</p>
          </div>
        </div>
      </div>
    </div>
  );
}


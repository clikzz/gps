import Link from "next/link"
import { TopicDetail } from "@/components/forum/topicDetail"
import { ReplyList } from "@/components/forum/replyList"
import { ReplyForm } from "@/components/forum/replyForm"
import { fetcher } from "@/lib/utils"
import { notFound } from "next/navigation"

interface Post {
  id: number
  content: string
  createdAt: string
  author: {
    name: string
    id: string
    menssageCount: number
  }
}

interface Topic {
  id: number
  title: string
  createdAt: string
  author: {
    name: string
    id: string
    menssageCount: number
  }
  Subforums: {
    name: string
    category: string
  }
}

async function getTopic(topicId: number): Promise<Topic | null> {
  try {
    const topics = await fetcher<Topic[]>("/api/forum/topics");
    return topics.find((t) => parseInt(String(t.id)) === topicId) || null;
  } catch (error) {
    console.error("Error fetching topic:", error);
    return null;
  }
}


async function getPosts(topicId: number): Promise<Post[]> {
  try {
    return await fetcher<Post[]>(`/api/forum/posts?topicId=${topicId}`)
  } catch (error) {
    return []
  }
}

interface TopicPageProps {
  params: {
    id: string
  }
}

export default async function TopicPage({ params }: TopicPageProps) {
  const topicId = Number.parseInt(params.id)
  if (isNaN(topicId)) {
    notFound()
  }

  const topic = await getTopic(topicId)
  if (!topic) {
    notFound()
  }

  const posts = await getPosts(topicId)
  const mainPost = posts.length > 0 ? posts[0] : null;
  const replies = posts.length > 1 ? posts.slice(1) : [];

  return (
    <div className="h-full w-full">
      <main className="h-full w-full px-4 py-6 space-y-6 max-w-6xl mx-auto">
        <div className="text-sm breadcrumbs">
          <Link href="/forum" className="hover:underline">
            Inicio
          </Link>
          {" > "}
          <span>{topic.Subforums.name}</span>
          {" > "}
          <span className="truncate">{topic.title}</span>
        </div>

        {mainPost && <TopicDetail topic={topic} mainPost={mainPost} />}
        <h2 className="text-2xl font-bold">Respuestas</h2>
        <ReplyList replies={replies} />

        <ReplyForm topicId={topicId} />
      </main>
    </div>
  )
}

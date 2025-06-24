import Link from "next/link"
import { TopicDetail } from "@/components/forum/topicDetail"
import { ReplyList } from "@/components/forum/replyList"
import { ReplyForm } from "@/components/forum/replyForm"
import { fetcher } from "@/lib/utils"
import { notFound } from "next/navigation"

export interface Post {
  id: number
  content: string
  createdAt: string
  updatedAt?: string
  subforumId: number 
  author: {
    name: string
    id: string
    tag: number
    menssageCount: number
    avatar_url?: string
  }
}

interface Topic {
  id: number
  title: string
  createdAt: string
  author: {
    name: string
    id: string
    tag: number
    menssageCount: number
    avatar_url?: string
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

export default async function TopicPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;
  const topicId = parseInt(id, 10);
  if (isNaN(topicId)) notFound();

  const topic = await getTopic(topicId);
  if (!topic) notFound();
  const posts = await getPosts(topicId);

  const [mainPost, ...replies] = posts;

  return (
    <div className="h-full w-full">
      <main className="h-full w-full px-4 py-6 space-y-6 max-w-6xl mx-auto">
        <div className="text-sm breadcrumbs">
          <Link href="/forum" className="hover:underline">
            Inicio
          </Link>
          {" > "}
          <Link href={`/forum/subforum/${slug}`} className="hover:underline">
            {topic.Subforums.name}
          </Link>
          {" > "}
          <span className="truncate">{topic.title}</span>
        </div>

        {mainPost && <TopicDetail 
        topic={{
          id: topic.id,
          title: topic.title,
          createdAt: topic.createdAt,
          author: topic.author,
          subforumId: topic.subforumId, 
          subforumSlug: slug,
        }}
        mainPost={mainPost}
        />}
        <h2 className="text-2xl font-bold">Respuestas</h2>
        <ReplyList replies={replies} />

        <ReplyForm topicId={topicId} />
      </main>
    </div>
  )
}

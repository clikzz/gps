import { ZodError } from "zod";
import { listSubforums, listTopics, listPosts, createTopic, createPost } from "../services/forum.service";
import { createTopicSchema, createPostSchema } from "../validations/forumValidation";
import { authenticateUser } from "../middlewares/authMiddleware";

export const fetchSubforums = async () => {
  const subs = await listSubforums();
  const formatted = subs.map(sf => ({
    ...sf,
    id: sf.id.toString(),
  }))

  return new Response(JSON.stringify(formatted), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  })
};


export const fetchTopics = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const sf = searchParams.get("subforumId");
  const subforumId = sf ? parseInt(sf) : undefined;
  const topics = await listTopics(subforumId);
  const formatted = topics.map((t) => ({
    id: t.id.toString(),
    subforumId: t.subforumId.toString(),
    title: t.title,
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
    postsCount: t.postsCount,
    author: {
      id: t.author.id,
      name: t.author.name,
      menssageCount: t.author.menssageCount,
    },
  }))

  return new Response(JSON.stringify(formatted), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  })
}


export const fetchPosts = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const tid = searchParams.get("topicId");
  if (!tid) {
    return new Response(
      JSON.stringify({ error: "Se requiere topicId" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
  const posts = await listPosts(+tid);
  return new Response(JSON.stringify(posts), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export const addTopic = async (req: Request) => {
  const user = await authenticateUser(req);
  if (user instanceof Response) return user;

  try {
    const body = await req.json();
    const dto = createTopicSchema.parse(body);
    const topic = await createTopic(user.id, dto);
    const formatted = {
      id: Number(topic.id),        
      subforumId: Number(topic.subforumId),
      userId: topic.userId,
      title: topic.title,
      createdAt: topic.createdAt.toISOString(),
      updatedAt: topic.updatedAt.toISOString(),
    }

    return new Response(JSON.stringify(formatted), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    })
  } catch (err) {
    if (err instanceof ZodError) {
      return new Response(
        JSON.stringify({ errors: err.errors }),
        { status: 422, headers: { "Content-Type": "application/json" } }
      )
    }
    console.error("Error en addTopic:", err);
    return new Response(
      JSON.stringify({ error: "Error interno" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}


export const addPost = async (req: Request) => {
  const user = await authenticateUser(req);
  if (user instanceof Response) return user;

  try {
    const body = await req.json();
    const dto = createPostSchema.parse(body);
    const post = await createPost(user.id, dto);

    const formatted = {
      id: post.id.toString(),
      topicId: post.topicId.toString(),
      userId: post.userId,
      content: post.content,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    }

    return new Response(JSON.stringify(formatted), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    })
  } catch (err) {
    if (err instanceof ZodError) {
      return new Response(
        JSON.stringify({ errors: err.errors }),
        { status: 422, headers: { "Content-Type": "application/json" } }
      )
    }
    console.error("Error en addPost:", err);
    return new Response(
      JSON.stringify({ error: "Error interno" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}


import { ZodError } from "zod";
import { listSubforums, listTopics, listPosts, createTopic, createPost } from "../services/forum.service";
import { createTopicSchema, createPostSchema } from "../validations/forum.validation";
import { authenticateUser } from "../middlewares/auth.middleware";

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
  const subforumId = sf && !isNaN(+sf) ? Number(sf) : undefined;

  const topics = await listTopics(subforumId);
  
  const formatted = topics.map((t) => ({
    id: Number(t.id),
    subforumId: Number(t.subforum_id),
    title: t.title,
    createdAt: t.created_at.toISOString(),
    updatedAt: t.updated_at.toISOString(),
    postsCount: t.postsCount,
    author: {
      id: t.author.id,
      name: t.author.name,
      menssageCount: t.author.menssageCount,
    },
    Subforums: {
      name: t.Subforums.name,
      category: t.Subforums.category,
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

  const formatted = posts.map(p => ({
    id: p.id.toString(),
    content: p.content,
    createdAt: p.created_at.toISOString(),
    author: {
      id: p.author.id,
      name: p.author.name,
      menssageCount: p.author.menssageCount,
    },
  }));

  return new Response(JSON.stringify(formatted), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const addTopic = async (req: Request) => {
  const user = await authenticateUser(req);
  if (user instanceof Response) return user;

  try {
    const body = await req.json();
    const dto = createTopicSchema.parse(body);
    const topic = await createTopic(user.id, dto);
    const formatted = {
      id: Number(topic.id),
      subforumId: Number(topic.subforum_id),
      userId: topic.user_id,
      title: topic.title,
      createdAt: topic.created_at.toISOString(),
      updatedAt: topic.updated_at.toISOString(),
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
    );
  }
  if (err instanceof Error && err.message.includes("10 segundos")) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  console.error("Error en addPost:", err);
  return new Response(
    JSON.stringify({ error: "Error interno" }),
    { status: 500, headers: { "Content-Type": "application/json" } }
  );
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
      topicId: post.topic_id.toString(),
      userId: post.user_id,
      content: post.content,
      createdAt: post.created_at.toISOString(),
      updatedAt: post.updated_at.toISOString(),
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
    );
  }
  if (err instanceof Error && err.message.includes("10 segundos")) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }
  console.error("Error en addPost:", err);
  return new Response(
    JSON.stringify({ error: "Error interno" }),
    { status: 500, headers: { "Content-Type": "application/json" } }
  );
}
}


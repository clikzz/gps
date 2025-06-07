import { ZodError } from "zod";
import { listSubforums, listTopics, listPosts, createTopic, createPost} from "../services/forumService";
import { createTopicSchema, createPostSchema} from "../validations/forumValidation";
import { authenticateUser } from "../middlewares/authMiddleware";

export const fetchSubforums = async () => {
  const subs = await listSubforums();
  return new Response(JSON.stringify(subs), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const fetchTopics = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const sf = searchParams.get("subforumId");
  const subforumId = sf ? parseInt(sf) : undefined;
  const topics = await listTopics(subforumId);
  return new Response(JSON.stringify(topics), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

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
};

export const addTopic = async (req: Request) => {
  const user = await authenticateUser(req);
  if (user instanceof Response) return user;

  try {
    const body = await req.json();
    const dto = createTopicSchema.parse(body);
    const topic = await createTopic(user.id, dto);
    return new Response(JSON.stringify(topic), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    if (err instanceof ZodError) {
      return new Response(JSON.stringify({ errors: err.errors }), {
        status: 422,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ error: "Error interno" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const addPost = async (req: Request) => {
  const user = await authenticateUser(req);
  if (user instanceof Response) return user;

  try {
    const body = await req.json();
    const dto = createPostSchema.parse(body);
    const post = await createPost(user.id, dto);
    return new Response(JSON.stringify(post), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    if (err instanceof ZodError) {
      return new Response(JSON.stringify({ errors: err.errors }), {
        status: 422,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ error: "Error interno" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

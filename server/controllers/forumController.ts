import { createTopicSchema, createPostSchema } from "../validations/forumValidation";
import * as svc from "../services/forumService";
import { ZodError } from "zod";

export const fetchTopics = async () => {
  const topics = await svc.listTopics();
  return new Response(JSON.stringify(topics), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const addTopic = async (req: Request, userId: string) => {
  try {
    const body = await req.json();
    const dto = createTopicSchema.parse(body);
    const topic = await svc.createTopic(userId, dto);
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

export const addPost = async (req: Request, userId: string) => {
  try {
    const body = await req.json();
    const dto = createPostSchema.parse(body);
    const post = await svc.createPost(userId, dto);
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

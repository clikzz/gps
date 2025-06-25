import prisma from "@/lib/db"; 
import { ZodError } from "zod";
import { 
  listSubforums, 
  listTopics, 
  listPosts, 
  createTopic, 
  createPost, 
  deleteOwnPost, 
  deleteOwnTopic, 
  updateOwnPost, 
  updateOwnTopic, 
  assignModerator, 
  revokeModerator,
  deleteAnyPost,
  deleteAnyTopic,
  updateUserRole,
  updateUserStatus,
  listUsers, 
  updateAnyPost,
} from "../services/forum.service";
import { createTopicSchema, createPostSchema,  editTopicSchema, editPostSchema} from "../validations/forum.validation";
import { authenticateUser, ensureAdmin, ensureModerator } from "../middlewares/auth.middleware";
import { NextResponse } from "next/server";


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

export const fetchUsers = async () => {
  const all = await listUsers();
  return new Response(JSON.stringify(all), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
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
      tag: t.author.tag,
      menssageCount: t.author.menssageCount,
      avatar_url: t.author.avatar_url,
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
      tag: p.author.tag,
      menssageCount: p.author.menssageCount,
      avatar_url: p.author.avatar_url,
    },
  }));

  return new Response(JSON.stringify(formatted), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const addTopic = async (req: Request) => {
  const authUser = await authenticateUser(req);
  if (authUser instanceof Response) return authUser;

  const profile = await prisma.users.findUnique({
    where: { id: authUser.id },
    select: {
      id: true,
      name: true,
      tag: true,
      menssageCount: true,
    },
  });

  if (!profile) {
    return new Response(
      JSON.stringify({ error: "Usuario no encontrado" }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const body = await req.json();
    const dto = createTopicSchema.parse(body);
    const topic = await createTopic(authUser.id, dto);

    const formatted = {
      id: Number(topic.id),
      subforumId: Number(topic.subforum_id),
      author: {
        id: profile.id,
        name: profile.name,
        tag: profile.tag,
        menssageCount: profile.menssageCount,
      },
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
  const authUser = await authenticateUser(req);
  if (authUser instanceof Response) return authUser;

  const profile = await prisma.users.findUnique({
    where: { id: authUser.id },
    select: { id: true, name: true, tag: true, menssageCount: true },
  });
  if (!profile) {
    return new Response(
      JSON.stringify({ error: "Usuario no encontrado" }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const body = await req.json();
    const dto = createPostSchema.parse(body);
    const post = await createPost(authUser.id, dto);

    const formatted = {
      id: post.id.toString(),
      topicId: post.topic_id.toString(),
      author: {
        id: profile.id,
        name: profile.name,
        tag: profile.tag,
        menssageCount: profile.menssageCount,
      },
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

export async function editOwnPost(req: Request) {
  const user = await authenticateUser(req);
  if (user instanceof Response) return user;

  const postId = Number(new URL(req.url).pathname.split("/").pop());
  if (isNaN(postId)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  try {
    const { content } = editPostSchema.parse(await req.json());
    const result = await updateOwnPost(user.id, postId, content);
    if (result.count === 0) {
      return NextResponse.json(
        { error: "No tienes permiso o mensaje no existe" },
        { status: 403 }
      );
    }
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { errors: err.errors },
        { status: 422 }
      );
    }
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error interno" },
      { status: 500 }
    );
  }
}

export async function removeOwnPost(req: Request) {
  const user = await authenticateUser(req);
  if (user instanceof Response) return user;

  const postId = Number(new URL(req.url).pathname.split("/").pop());
  if (isNaN(postId)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const result = await deleteOwnPost(user.id, postId);
  if (result.count === 0) {
    return NextResponse.json(
      { error: "No tienes permiso o mensaje no existe" },
      { status: 403 }
    );
  }
  return new NextResponse(null, { status: 204 });
}

export async function editOwnTopic(req: Request) {
  const user = await authenticateUser(req);
  if (user instanceof Response) return user;

  const topicId = Number(new URL(req.url).pathname.split("/").pop());
  if (isNaN(topicId)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  try {
    const { title } = editTopicSchema.parse(await req.json());
    const result = await updateOwnTopic(user.id, topicId, title);
    if (result.count === 0) {
      return NextResponse.json(
        { error: "No tienes permiso o tema no existe" },
        { status: 403 }
      );
    }
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { errors: err.errors },
        { status: 422 }
      );
    }
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error interno" },
      { status: 500 }
    );
  }
}

export async function removeOwnTopic(req: Request) {
  const user = await authenticateUser(req);
  if (user instanceof Response) return user;

  const topicId = Number(new URL(req.url).pathname.split("/").pop());
  if (isNaN(topicId)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const result = await deleteOwnTopic(user.id, topicId);
  if (result.count === 0) {
    return NextResponse.json(
      { error: "No tienes permiso o tema no existe" },
      { status: 403 }
    );
  }
  return new NextResponse(null, { status: 204 });
}

export async function addModerator(req: Request) {
  const user = await authenticateUser(req);
  if (user instanceof Response) return user;
  try {
    ensureAdmin(user);
    const { userId } = await req.json();
    await assignModerator(userId);
    return new Response(null, { status: 204 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
}

export async function removeModerator(req: Request) {
  const user = await authenticateUser(req);
  if (user instanceof Response) return user;
  try {
    ensureAdmin(user);
    const { userId } = await req.json();
    await revokeModerator(userId);
    return new Response(null, { status: 204 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
}

export async function deleteAnyPostHandler(req: Request) {
  const user = await authenticateUser(req);
  if (user instanceof Response) return user;
  try { ensureAdmin(user); } catch {
    return NextResponse.json({ error: "No tienes permisos" }, { status: 403 });
  }
  const postId = Number(new URL(req.url).pathname.split("/").pop());
  await deleteAnyPost(postId);
  return new Response(null, { status: 204 });
}

export async function deleteAnyTopicHandler(req: Request) {
  const user = await authenticateUser(req);
  if (user instanceof Response) return user;
  try { ensureAdmin(user); } catch {
    return NextResponse.json({ error: "No tienes permisos" }, { status: 403 });
  }
  const topicId = Number(new URL(req.url).pathname.split("/").pop());
  await deleteAnyTopic(topicId);
  return new Response(null, { status: 204 });
}

export async function editAnyPostHandler(req: Request) {
  const user = await authenticateUser(req);
  if (user instanceof Response) return user;
  try { ensureModerator(user); } catch {
    return NextResponse.json({ error: "No tienes permisos" }, { status: 403 });
  }
  const postId = Number(new URL(req.url).pathname.split("/").pop());
  const { content } = editPostSchema.parse(await req.json());
  await updateAnyPost(user.id, postId, content);
  return NextResponse.json(null, { status: 204 });
}


export async function changeUserStatus(req: Request) {
  const auth = await authenticateUser(req)
  if (auth instanceof Response) return auth

  try { ensureModerator(auth) } catch {
    return NextResponse.json({ error: "No tienes permisos" }, { status: 403 })
  }

  const { targetUserId, status } = await req.json() as {
    targetUserId: string
    status: "ACTIVE" | "SUSPENDED" | "BANNED"
  }

  try {
    await updateUserStatus(auth.id, targetUserId, status)
    return NextResponse.json(null, { status: 204 })
  } catch (err: any) {
    const code = err.message === "CANNOT_MODIFY_ADMIN" ? 400 : 500
    return NextResponse.json({ error: err.message }, { status: code })
  }
}

export async function changeUserRole(req: Request) {
  const auth = await authenticateUser(req)
  if (auth instanceof Response) return auth

  try { ensureAdmin(auth) } catch {
    return NextResponse.json({ error: "No tienes permisos" }, { status: 403 })
  }

  const { targetUserId, role } = await req.json() as {
    targetUserId: string
    role: "MODERATOR" | "USER"
  }

  try {
    await updateUserRole(auth.id, targetUserId, role)
    return NextResponse.json(null, { status: 204 })
  } catch (err: any) {
    const code = err.message === "CANNOT_MODIFY_ADMIN" ? 400 : 500
    return NextResponse.json({ error: err.message }, { status: code })
  }
}
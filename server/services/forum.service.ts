import prisma from "@/lib/db";
import { Topics, Posts, users, Subforums } from "@prisma/client";

export const listSubforums = async (): Promise<Subforums[]> => {
  return prisma.subforums.findMany({
    orderBy: { category: "asc" }
  });
};

export const listTopics = async (
  subforumId?: number
): Promise<
  (
    Topics & {
      postsCount: number;
      author: Pick<users, "id" | "name" | "tag" | "menssageCount">;
      Subforums: Pick<Subforums, "name" | "category">;
    }
  )[]
> => {
  const where = subforumId !== undefined ? { subforum_id: subforumId } : {};

  const topics = await prisma.topics.findMany({
    where,
    include: {
      users: 
        { select: { id: true, name: true, tag: true, menssageCount: true } },
      Posts: 
        { select: { id: true } },
      Subforums: 
      { select: { name: true, category: true }}
    },
    orderBy: { updated_at: "desc" },
  });

  return topics.map(t => ({
    ...t,
    postsCount: t.Posts.length,
    author: t.users,
    Subforums: t.Subforums,
  }));
};

export const listPosts = async (
  topicId: number
): Promise<
  (
    Posts & {
      author: Pick<users, "id" | "name" | "tag" | "menssageCount">;
    }
  )[]
> => {
  return prisma.posts.findMany({
    where: { topic_id: topicId },
    include: { 
      users: { select: { id: true, name: true, tag: true, menssageCount: true}} 
    },
    orderBy: { created_at: "asc" },
  }).then(posts =>
    posts.map(p => ({ ...p, author: p.users }))
  );
};

export const createTopic = async (
  userId: string,
  dto: { subforumId: number; title: string; content: string }
) => {
  return prisma.$transaction(async (tx) => {
    const profile = await tx.users.findUnique({ where: { id: userId } });

    if (profile?.lastMessageAt) {
      const secondsSinceLast = (Date.now() - new Date(profile.lastMessageAt).getTime()) / 1000;
      if (secondsSinceLast < 10) {
        throw new Error("Debes esperar 10 segundos entre publicaciones.");
      }
    }
    const topic = await tx.topics.create({
      data: {
        user_id: userId,
        subforum_id: dto.subforumId,
        title: dto.title,
      },
    });
    await tx.posts.create({
      data: { topic_id: topic.id, user_id: userId, content: dto.content },
    });
    await tx.users.update({
      where: { id: userId },
      data: {
        menssageCount: { increment: 1 },
        lastMessageAt: new Date(),
      },
    });

    return topic;
  });
};

export const createPost = async (
  userId: string,
  dto: { topicId: number; content: string }
) => {
  return prisma.$transaction(async tx => {
    const profile = await tx.users.findUnique({ where: { id: userId } });
    if (profile?.lastMessageAt) {
      const secondsSinceLast = (Date.now() - new Date(profile.lastMessageAt).getTime()) / 1000;
      if (secondsSinceLast < 10) {
        throw new Error("Debes esperar 10 segundos entre publicaciones.");
      }
    }
    const post = await tx.posts.create({
      data: { topic_id: dto.topicId, user_id: userId, content: dto.content },
    });
    await tx.users.update({
      where: { id: userId },
      data: {
        menssageCount: { increment: 1 },
        lastMessageAt: new Date(),
      },
    });
    return post;
  });
};

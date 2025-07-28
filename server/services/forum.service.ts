import prisma from "@/lib/db";
import { Topics, Posts, users, Subforums, Role, UserStatus } from "@prisma/client";
import { assignBadge } from "./badge.service";

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
      author: Pick<users, "id" | "name" | "tag" | "menssageCount" | "avatar_url">;
      Subforums: Pick<Subforums, "name" | "category">;
    }
  )[]
> => {
  const where = subforumId !== undefined ? { subforum_id: subforumId } : {};

  const topics = await prisma.topics.findMany({
    where,
    include: {
      users: 
        { select: { id: true, name: true, tag: true, menssageCount: true, avatar_url: true } },
      Posts: 
        { select: { id: true } },
      Subforums: 
      { select: { name: true, category: true }}
    },
    orderBy: [
      { featured: "desc" },     
      { updated_at: "desc" }    
    ],
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
      author: Pick<users, "id" | "name" | "tag" | "menssageCount" | "avatar_url">;
    }
  )[]
> => {
  return prisma.posts.findMany({
    where: { topic_id: topicId },
    include: { 
      users: { select: { id: true, name: true, tag: true, menssageCount: true, avatar_url: true } } 
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
    const updatedUser = await tx.users.update({
      where: { id: userId },
      data: {
        menssageCount: { increment: 1 },
        lastMessageAt: new Date(),
      },
    });

    if (updatedUser.menssageCount === 10) {
      await assignBadge(userId, "MSG_10");
    }
    if (updatedUser.menssageCount === 30) {
      await assignBadge(userId, "MSG_30");
    }

    return topic;
  });
};

export const createPost = async (
  userId: string,
  dto: { topicId: number; content: string }
) => {
  return prisma.$transaction(async tx => {
    const topic = await tx.topics.findUnique({
      where: { id: dto.topicId },
      select: { locked: true }
    });
    if (!topic) {
      throw new Error("TOPIC_NOT_FOUND");
    }
    if (topic.locked) {
      throw new Error("TOPIC_LOCKED");
    }

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

    if (profile?.menssageCount === 10) {
      await assignBadge(userId, "MSG_10");
    }
    
    return post;
  });
};

export async function updateOwnPost(
  userId: string,
  postId: number,
  content: string
) {
  return prisma.posts.updateMany({
    where: { id: postId, user_id: userId },
    data: { content, updated_at: new Date() },
  });
}

export async function updateAnyPost(
  editorId: string,
  postId: number,
  content: string
) {
  return prisma.posts.update({
    where: { id: postId },
    data: {
      content,
      moderated_at: new Date(),    
      moderated_by: editorId,      
    },
  });
}

export async function deleteOwnPost(
  userId: string,
  postId: number
) {
  return prisma.$transaction(async (tx) => {
    const deleted = await tx.posts.deleteMany({
      where: { id: postId, user_id: userId },
    });
    if (deleted.count > 0) {
      await tx.users.update({
        where: { id: userId },
        data: { menssageCount: { decrement: 1 } },
      });
    }
    return deleted;
  });
}

export async function deleteAnyPost(postId: number) {
  return prisma.$transaction(async tx => {
    const post = await tx.posts.findUnique({ where: { id: postId } });
    if (!post) throw new Error("NOT_FOUND");
    await tx.posts.delete({ where: { id: postId } });
    await tx.users.update({
      where: { id: post.user_id },
      data: { menssageCount: { decrement: 1 } },
    });
  });
}

export async function updateOwnTopic(
  userId: string,
  topicId: number,
  title: string
) {
  return prisma.topics.updateMany({
    where: { id: topicId, user_id: userId },
    data: { title, updated_at: new Date() },
  });
}

export async function updateAnyTopic(
  editorId: string,
  topicId: number,
  title: string
) {
  return prisma.topics.update({
    where: { id: topicId },
    data: {
      title,
      updated_at: new Date(),
      // moderado_por: editorId,
      // moderado_en: new Date(),
    },
  });
}

export async function deleteOwnTopic(
  userId: string,
  topicId: number
) {
  return prisma.$transaction(async (tx) => {
    const count = await tx.posts.count({
      where: { topic_id: topicId, user_id: userId },
    });
    const deleted = await tx.topics.deleteMany({
      where: { id: topicId, user_id: userId },
    });
    if (deleted.count > 0 && count > 0) {
      await tx.users.update({
        where: { id: userId },
        data: { menssageCount: { decrement: count } },
      });
    }
    return deleted;
  });
}

export async function deleteAnyTopic(topicId: number) {
  return prisma.$transaction(async tx => {
    const posts = await tx.posts.findMany({ where: { topic_id: topicId } });
    await tx.posts.deleteMany({ where: { topic_id: topicId } });
    for (const p of posts) {
      await tx.users.update({
        where: { id: p.user_id },
        data: { menssageCount: { decrement: 1 } },
      });
    }
    await tx.topics.delete({ where: { id: topicId } });
  });
}

export async function assignModerator(userId: string) {
  return prisma.users.update({
    where: { id: userId },
    data: { role: "MODERATOR" },
  });
}

export async function revokeModerator(userId: string) {
  return prisma.users.update({
    where: { id: userId },
    data: { role: "USER" },
  });
}

export async function updateUserStatus(
  currentUserId: string,
  targetUserId: string,
  status: UserStatus,
  suspensionReason?: string,
  suspensionUntil?: string
) {
  const me = await prisma.users.findUnique({ where: { id: currentUserId } })
  if (!me || (me.role !== "MODERATOR" && me.role !== "ADMIN")) {
    throw new Error("FORBIDDEN_MODERATOR")
  }
  const target = await prisma.users.findUnique({ where: { id: targetUserId } })
  if (!target || target.role === "ADMIN") {
    throw new Error("CANNOT_MODIFY_ADMIN")
  }

  return prisma.users.update({
    where: { id: targetUserId },
    data: {
      status,
      ...(status === "SUSPENDED" && {
        suspensionReason,
        suspensionUntil: new Date(suspensionUntil!),
      }),
      ...(status === "ACTIVE" && {
        suspensionReason: null,
        suspensionUntil: null,
      }),
    },
  });
}

export async function updateUserRole(
  currentUserId: string,
  targetUserId: string,
  role: Role
) {
  const me = await prisma.users.findUnique({ where: { id: currentUserId } });
  if (!me || me.role !== "ADMIN") {
    throw new Error("FORBIDDEN_ADMIN");
  }
  return prisma.users.update({
    where: { id: targetUserId },
    data: { role },
  });
}

export async function listUsers(): Promise<
  Array<Pick<
    users,
    "id" | "name" | "tag" | "menssageCount" | "role" | "status"
  >>
> {
  await prisma.users.updateMany({
    where: {
      status: UserStatus.SUSPENDED,
      suspensionUntil: { lte: new Date() },
    },
    data: {
      status: UserStatus.ACTIVE,
      suspensionUntil: null,
      suspensionReason: null,
    },
  })

  return prisma.users.findMany({
    select: {
      id: true,
      name: true,
      tag: true,
      menssageCount: true,
      role: true,
      status: true,
    },
    orderBy: { name: "asc" },
  });
}

export async function updateTopicLock(
  currentUserId: string,
  topicId: number,
  locked: boolean
) {
  const me = await prisma.users.findUnique({ where: { id: currentUserId } });
  if (!me || (me.role !== "MODERATOR" && me.role !== "ADMIN")) {
    throw new Error("FORBIDDEN_MODERATOR");
  }

  return prisma.topics.update({
    where: { id: topicId },
    data: { locked: locked, updated_at: new Date() },
  });
}

export async function updateTopicFeatured(
  currentUserId: string,
  topicId: number,
  featured: boolean
) {
  const me = await prisma.users.findUnique({ where: { id: currentUserId } });
  if (!me || (me.role !== "MODERATOR" && me.role !== "ADMIN")) {
    throw new Error("FORBIDDEN_MODERATOR");
  }
  return prisma.topics.update({
    where: { id: topicId },
    data: { featured, updated_at: new Date() },
  });
}
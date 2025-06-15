import prisma from "@/lib/db";
import { Topics, Posts, UserProfile } from "@prisma/client";

export const listSubforums = async () => {
  return prisma.subforums.findMany({
    orderBy: { category: "asc" }
  });
};

export const listTopics = async (subforumId?: number): Promise<(Topics & { author: UserProfile; postsCount: number })[]> => {
  const where = subforumId ? { subforumId } : {};
  const topics = await prisma.topics.findMany({
    where,
    include: {
      UserProfiles: true,                
      Posts: { select: { id: true } },   
    },
    orderBy: { updatedAt: "desc" },
  });

  return topics.map(t => ({
    ...t,
    postsCount: t.Posts.length,
    author: t.UserProfiles,
  }));
};

export const listPosts = async (topicId: number): Promise<(Posts & { author: UserProfile })[]> => {
  return prisma.posts.findMany({
    where: { topicId },
    include: { UserProfiles: true },
    orderBy: { createdAt: "asc" },
  }).then(posts =>
    posts.map(p => ({ ...p, author: p.UserProfiles }))
  );
};

export const createTopic = async (
  userId: string,
  dto: { subforumId: number; title: string; content: string }
) => {
  return prisma.$transaction(async (tx) => {
    const topic = await tx.topics.create({
      data: {
        userId,
        subforumId: dto.subforumId,
        title: dto.title,
      },
    });
    await tx.posts.create({
      data: { topicId: topic.id, userId, content: dto.content },
    });

    const before = await tx.userProfile.findUnique({ where: { id: userId } });
    console.log("userProfile antes de update:", before);

    const updated = await tx.userProfile.update({
      where: { id: userId },
      data: {
        menssageCount: { increment: 1 },
        lastMessageAt: new Date(),
      },
    });
    console.log("userProfile después de update:", updated);
    return topic;
  });
};


export const createPost = async (
  userId: string,
  dto: { topicId: number; content: string }
) => {
  return prisma.$transaction(async tx => {
    const post = await tx.posts.create({
      data: { topicId: dto.topicId, userId, content: dto.content },
    });
    await tx.userProfile.update({
      where: { id: userId },
      data: {
        menssageCount: { increment: 1 },
        lastMessageAt: new Date(),
      },
    });
    return post;
  });
};
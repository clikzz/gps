import prisma from "@/lib/db"; 

export const listTopics = async (subforumId?: number) => {
  return prisma.topic.findMany({
    where: subforumId ? { subforumId } : {},
    include: {
      author: { select: { id: true, name: true } },
      posts: true, 
    },
    orderBy: { createdAt: "desc" },
  });
};

export const createTopic = async (
  userId: string,
  data: { subforumId: number; title: string; content: string }
) => {
  return prisma.topic.create({
    data: {
      subforum: { connect: { id: data.subforumId } },
      author: { connect: { id: userId } },
      title: data.title,
      posts: {
        create: [{ content: data.content, author: { connect: { id: userId } } }],
      },
    },
    include: {
      author: { select: { id: true, name: true } },
      posts: { include: { author: { select: { id: true, name: true } } } },
    },
  });
};

export const createPost = async (
  userId: string,
  data: { topicId: number; content: string }
) => {
  return prisma.post.create({
    data: {
      topic: { connect: { id: data.topicId } },
      author: { connect: { id: userId } },
      content: data.content,
    },
    include: { author: { select: { id: true, name: true } } },
  });
};




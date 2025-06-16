import prisma from "@/lib/db";

export const getUserProfile = async (userId: string) => {
  return await prisma.users.findUnique({
    where: { id: userId },
    include: {
      Pets: {
        where: {
          deleted: false,
        },
      },
    },
  });
};

export const updateUserProfile = async (
  userId: string,
  {
    name,
    email,
    avatar_url,
  }: { name: string; email: string; avatar_url: string }
) => {
  return await prisma.users.update({
    where: { id: userId },
    data: { name, email, avatar_url },
  });
};

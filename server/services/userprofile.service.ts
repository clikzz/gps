import prisma from "@/lib/db";

export const getUserProfile = async (userId: string) => {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      pets: {
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
  return await prisma.user.update({
    where: { id: userId },
    data: { name, email, avatar_url },
  });
};

import prisma from "@/lib/db";

export const getUserProfile = async (userId: string) => {
  return await prisma.userProfile.findUnique({
    where: { id: userId },
    include: {
      pets: true,
      photoLogs: true,
      forums: true,
      badges: true,
      reviews: true,
      lostPets: true,
      marketplaceItems: true,
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
  return await prisma.userProfile.update({
    where: { id: userId },
    data: { name, email, avatar_url },
  });
};

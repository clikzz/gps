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
  }: { name: string; email: string; avatar_url: string | null }
) => {
  const defaultAvatarUrl = "https://fwjwzustxplwudyivyjs.supabase.co/storage/v1/object/public/images/profile/defaultpfp.png";
  const finalAvatarUrl = avatar_url === null ? defaultAvatarUrl : avatar_url;

  return await prisma.users.update({
    where: { id: userId },
    data: { name, email, avatar_url: finalAvatarUrl },
    include: {
      Pets: {
        where: {
          deleted: false,
        },
      },
    },
  });
};

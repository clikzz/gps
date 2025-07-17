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
      userBadges: {
        include: { badge: true }
      }
    },
  });
};

export const updateUserProfile = async (
  userId: string,
  {
    name,
    email,
    avatar_url,
    selectedBadgeIds,
  }: { 
    name: string; 
    email: string; 
    avatar_url: string | null;
    selectedBadgeIds?: string[];
  }
) => {
  const defaultAvatarUrl = "https://fwjwzustxplwudyivyjs.supabase.co/storage/v1/object/public/images/profile/defaultpfp.png";
  const finalAvatarUrl = avatar_url === null ? defaultAvatarUrl : avatar_url;

  const updateData: any = { 
    name, 
    email, 
    avatar_url: finalAvatarUrl 
  };

  if (selectedBadgeIds !== undefined) {
    updateData.selectedBadgeIds = selectedBadgeIds;
  }

  return await prisma.users.update({
    where: { id: userId },
    data: updateData,
    include: {
      Pets: {
        where: {
          deleted: false,
        },
      },
        userBadges: {
          include: { badge: true },
        },
      },
    });
};

export async function updateBadgeSelection(
  userId: string,
  badgeIds: string[]
) {
  return prisma.users.update({
    where: { id: userId },
    data: { selectedBadgeIds: badgeIds },
  });
}
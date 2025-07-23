import prisma from "@/lib/db";
import { UpdateUserProfileInput } from "@/server/validations/userprofile.validations"

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

export const getAllBadges = async () => {
  return await prisma.badge.findMany({
    orderBy: { name: 'asc' }
  });
};

export const updateUserProfile = async (
  userId: string,
  data: UpdateUserProfileInput
) => {
  const {
    name,
    email,
    avatar_url,
    selectedBadgeIds,
    instagram,
    phone,
  } = data;
  
  const defaultAvatarUrl = "https://fwjwzustxplwudyivyjs.supabase.co/storage/v1/object/public/images/profile/defaultpfp.png";
  const finalAvatarUrl = avatar_url === null ? defaultAvatarUrl : avatar_url;

  const updateData: any = {
    ...(name !== undefined && { name }),
    ...(email !== undefined && { email }),
    avatar_url: finalAvatarUrl,
    ...(selectedBadgeIds && { selectedBadgeIds }),
    ...(instagram !== undefined && { instagram }),
    ...(phone !== undefined && { phone }),
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
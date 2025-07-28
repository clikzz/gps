import prisma from "@/lib/db";
import { UpdateUserProfileInput } from "@/server/validations/userprofile.validations"

export const getUserProfile = async (userId: string) => {
  const user = await prisma.users.findUnique({
    where: { id: userId },
    include: {
      Pets: {
        where: { deleted: false },
      },
      userBadges: {
        include: { badge: true },
      },
    },
  });

  if (!user) return null;

  const badgeKeysByRole: Record<string, string> = {
    ADMIN: "ADMIN_ROLE",
    MODERATOR: "MODERATOR_ROLE",
  };

  const roleKeys = Object.keys(badgeKeysByRole);
  const currentRoleKey = badgeKeysByRole[user.role];
  const badgeAssignments = user.userBadges.map((ub) => ub.badge.key);

  if (currentRoleKey && !badgeAssignments.includes(currentRoleKey)) {
    const badge = await prisma.badge.findUnique({ where: { key: currentRoleKey } });
    if (badge) {
      await prisma.userBadge.create({
        data: {
          userId: user.id,
          badgeId: badge.id,
        },
      });
    }
  }

  for (const role of roleKeys) {
    const key = badgeKeysByRole[role];
    if (key !== currentRoleKey && badgeAssignments.includes(key)) {
      const badge = await prisma.badge.findUnique({ where: { key } });
      if (badge) {
        await prisma.userBadge.deleteMany({
          where: {
            userId: user.id,
            badgeId: badge.id,
          },
        });
      }
    }
  }

  return await prisma.users.findUnique({
    where: { id: userId },
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
  };

  if (selectedBadgeIds !== undefined) {
    updateData.selectedBadgeIds = selectedBadgeIds;
  }

  if (instagram !== undefined) {
    updateData.instagram = instagram || null;
  }

  if (phone !== undefined) {
    const cleanPhone = phone ? phone.replace(/\s+/g, '') : null;
    updateData.phone = cleanPhone;
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

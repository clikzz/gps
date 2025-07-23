import {
  getUserProfile,
  updateUserProfile,
  getAllBadges,
} from "@/server/services/userprofile.service";
import { Pets as Pet } from "@prisma/client";
import { UpdateUserProfileSchema } from "@/server/validations/userprofile.validations"

export const fetchUserProfile = async (userId: string) => {
  const [profile, allBadges] = await Promise.all([
    getUserProfile(userId),
    getAllBadges()
  ]);

  if (!profile) {
    return new Response(JSON.stringify({ error: "Profile not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const userBadgeIds = profile.userBadges.map(ub => ub.badge.id);

  const unlockedBadges = allBadges
    .filter(badge => userBadgeIds.includes(badge.id))
    .map(badge => ({
      id: badge.id.toString(),
      label: badge.name,
      icon: badge.icon_url!,
      description: badge.description || "",
      key: badge.key
    }));

  const lockedBadges = allBadges
    .filter(badge => !userBadgeIds.includes(badge.id))
    .map(badge => ({
      id: badge.id.toString(),
      label: badge.name,
      icon: badge.icon_url!,
      description: badge.description || "",
      key: badge.key
    }));

  const userProfile = {
    ...profile,
    tag: profile.tag.toString(),
    Pets: profile.Pets.map((pet: Pet) => ({
      ...pet,
      id: pet.id.toString(),
    })),
    badges: unlockedBadges,
    unlockedBadges,
    lockedBadges,
  };

  return new Response(JSON.stringify(userProfile), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};


export const modifyUserProfile = async (userId: string, body: any) => {
  const parsed = UpdateUserProfileSchema.safeParse(body);

  if (!parsed.success) {
    return new Response(JSON.stringify({ error: parsed.error.flatten() }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const validatedData = parsed.data;

  const [updatedProfile, allBadges] = await Promise.all([
    updateUserProfile(userId, validatedData),
    getAllBadges(),
  ]);

  const userBadgeIds =
    (updatedProfile as any).userBadges?.map((ub: any) => ub.badge.id) || [];

  const unlockedBadges = allBadges
    .filter((badge) => userBadgeIds.includes(badge.id))
    .map((badge) => ({
      id: badge.id.toString(),
      label: badge.name,
      icon: badge.icon_url!,
      description: badge.description || "",
      key: badge.key,
    }));

  const lockedBadges = allBadges
    .filter((badge) => !userBadgeIds.includes(badge.id))
    .map((badge) => ({
      id: badge.id.toString(),
      label: badge.name,
      icon: badge.icon_url!,
      description: badge.description || "",
      key: badge.key,
    }));

  const serializedProfile = {
    ...updatedProfile,
    tag: updatedProfile?.tag?.toString(),
    instagram: updatedProfile.instagram,
    phone: updatedProfile.phone,
    selectedBadgeIds: updatedProfile?.selectedBadgeIds || [],
    Pets: updatedProfile?.Pets?.map((pet: Pet) => ({
      ...pet,
      id: pet.id.toString(),
    })),
    badges: unlockedBadges,
    unlockedBadges,
    lockedBadges,
  };

  return new Response(JSON.stringify(serializedProfile), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
import {
  getUserProfile,
  updateUserProfile,
  getAllBadges,
} from "@/server/services/userprofile.service";
import { Pets as Pet } from "@prisma/client";

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

  // Get user's unlocked badge IDs
  const userBadgeIds = profile.userBadges.map(ub => ub.badge.id);
  
  // Separate badges into unlocked and locked
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
    badges: unlockedBadges, // Keep for backward compatibility
    unlockedBadges,
    lockedBadges,
  };
  
  return new Response(JSON.stringify(userProfile), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};


export const modifyUserProfile = async (
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
  const [updatedProfile, allBadges] = await Promise.all([
    updateUserProfile(userId, {
      name,
      email,
      avatar_url,
      selectedBadgeIds,
    }),
    getAllBadges()
  ]);

  // Get user's unlocked badge IDs
  const userBadgeIds = (updatedProfile as any).userBadges?.map((ub: any) => ub.badge.id) || [];
  
  // Separate badges into unlocked and locked
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

  const serializedProfile = {
    ...updatedProfile,
    tag: updatedProfile?.tag?.toString(),
    selectedBadgeIds: updatedProfile?.selectedBadgeIds || [],
    Pets: updatedProfile?.Pets?.map((pet: Pet) => ({
      ...pet,
      id: pet.id.toString(),
    })),
    badges: unlockedBadges, // Keep for backward compatibility
    unlockedBadges,
    lockedBadges,
  };

  return new Response(JSON.stringify(serializedProfile), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

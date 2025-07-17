import {
  getUserProfile,
  updateUserProfile,
} from "@/server/services/userprofile.service";
import { Pets as Pet } from "@prisma/client";

export const fetchUserProfile = async (userId: string) => {
  const profile = await getUserProfile(userId);
  if (!profile) {
    return new Response(JSON.stringify({ error: "Profile not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }
  const userProfile = {
    ...profile,
    tag: profile.tag.toString(),
    Pets: profile.Pets.map((pet: Pet) => ({
      ...pet,
      id: pet.id.toString(),
    })),
    badges: profile.userBadges.map(ub => ({
      id: ub.badge.id.toString(),
      label: ub.badge.name,
      icon: ub.badge.icon_url!,
      description: ub.badge.description || ""
    })),
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
  const updatedProfile = await updateUserProfile(userId, {
    name,
    email,
    avatar_url,
    selectedBadgeIds,
  });

  const serializedProfile = {
    ...updatedProfile,
    tag: updatedProfile?.tag?.toString(),
    selectedBadgeIds: updatedProfile?.selectedBadgeIds || [],
    Pets: updatedProfile?.Pets?.map((pet: Pet) => ({
      ...pet,
      id: pet.id.toString(),
    })),
    badges: (updatedProfile as any).userBadges?.map((ub: any) => ({
      id: ub.badge.id.toString(),
      label: ub.badge.name,
      icon: ub.badge.icon_url!,
      description: ub.badge.description || ""
    })) || [],
  };

  return new Response(JSON.stringify(serializedProfile), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

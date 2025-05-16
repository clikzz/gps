import {
  getUserProfile,
  updateUserProfile,
} from "@/server/services/userProfileService";
import { Pets as Pet } from "@prisma/client";

export const fetchUserProfile = async (userId: string) => {
  const profile = await getUserProfile(userId);
  const userProfile = {
    ...profile,
    pets: profile?.pets.map((pet: Pet) => ({
      ...pet,
      id: pet.id.toString(),
    })),
  };
  if (!profile) {
    return new Response(JSON.stringify({ error: "Profile not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

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
  }: { name: string; email: string; avatar_url: string }
) => {
  const updatedProfile = await updateUserProfile(userId, {
    name,
    email,
    avatar_url,
  });
  return new Response(JSON.stringify(updatedProfile), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

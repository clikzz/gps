"use client";

import { useEffect } from "react";
import { useUserProfile } from "@/stores/userProfile";

interface UserProfile {
  id: string;
  name: string | null;
  avatar_url: string | null;
  email: string;
  public_id: string | null;
  menssageCount: number;
  role: string;
  Pets?: any[];
  badges?: any[];
  unlockedBadges?: any[];
  lockedBadges?: any[];
  [key: string]: any;
}

interface UserProfileInitializerProps {
  userProfile: UserProfile | null;
}

export function UserProfileInitializer({ userProfile }: UserProfileInitializerProps) {
  const { setUser, user } = useUserProfile();

  useEffect(() => {
    // Solo inicializar si no hay usuario en el store y tenemos userProfile
    if (!user && userProfile) {
      setUser({
        id: userProfile.id,
        email: userProfile.email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        name: userProfile.name || undefined,
        avatar_url: userProfile.avatar_url || undefined,
        tag: userProfile.public_id || undefined,
        Pets: userProfile.Pets || [],
        photoLogs: [],
        forums: [],
        badges: userProfile.badges || [],
        unlockedBadges: userProfile.unlockedBadges || [],
        lockedBadges: userProfile.lockedBadges || [],
        reviews: [],
        lostPets: [],
        marketplaceItems: [],
        role: userProfile.role as any,
        status: "ACTIVE" as any,
        menssageCount: userProfile.menssageCount || 0,
        selectedBadgeIds: userProfile.selectedBadgeIds || [],
      });
    }
  }, [userProfile, setUser, user]);

  return null; // Este componente no renderiza nada
}
